// src/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mediasoup = require('mediasoup');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));
let mediaRouter; // Global reference to mediasoup router



const { createWorker } = require('./mediasoup-config');
(async () => {
  const router = await createWorker();
  mediaRouter = router

})();



io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle client requests for MediaSoup
  socket.on('joinRoom', async ({ username, roomId }, callback) => {
    console.log(`Client joined room: ${roomId}`);
    socket.join(roomId);
    io.to(roomId).emit('roomJoined', { username, roomId });

    try {
      const transport = await createWebRtcTransport(mediaRouter);

      callback({
        transportOptions: {
          id: transport.id,
          iceParameters: transport.iceParameters,
          iceCandidates: transport.iceCandidates,
          dtlsParameters: transport.dtlsParameters
        }
      });
    } catch (err) {
      console.error('Failed to create WebRTC transport:', err);
      callback({ error: err.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


const createWebRtcTransport = async (router) => {
  const transport = await router.createWebRtcTransport({
    listenIps: [{ ip: '0.0.0.0', announcedIp: 'YOUR_SERVER_IP' }],
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
  });

  transport.on('dtlsstatechange', dtlsState => {
    if (dtlsState === 'closed') {
      transport.close();
    }
  });

  transport.on('close', () => {
    console.log('Transport closed');
  });

  return transport;
};






server.listen(3000, () => {
  console.log('Server is running on port 3000');
});