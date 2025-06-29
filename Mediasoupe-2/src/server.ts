import { WorkerEvents } from "./../node_modules/mediasoup/node/lib/WorkerTypes.d";
import mediasoup, { createWorker } from "mediasoup";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { mediaCodecs } from "./mediasoup/codec";


const app = express();
const port = 400;
const server = http.createServer(app);
let worker: mediasoup.types.Worker<mediasoup.types.AppData>;
let router: mediasoup.types.Router<mediasoup.types.AppData>;

//init a socketio server
const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true,
    },
});

async function Work() {
    worker = await createWorker();
}
Work();

const peers = io.of("/mediasoup");

peers.on("connection", async (socket) => {
    router = await worker.createRouter({
        mediaCodecs: mediaCodecs,
    });





    socket.on("getRouterRtpCapabilities", (callback) => {
        // ... Handling router RTP capabilities ...
    });




    socket.on("createTransport", async ({ sender }, callback) => {
        // ... Creating sender/receiver transports ...
    });



    socket.on("connectProducerTransport", async ({ dtlsParameters }) => {
        // ... Connecting the sending transport ...
    });




    socket.on("transport-produce",async ({ kind, rtpParameters }, callback) => {
            // ... Producing media ...
        }
    );




    socket.on("connectConsumerTransport", async ({ dtlsParameters }) => {
        // ... Connecting the receiving transport ...
    });


    socket.on("consumeMedia", async ({ rtpCapabilities }, callback) => {
        // ... Consuming media ...
    });
    socket.on("resumePausedConsumer", async (data) => {
        // ... Resuming media consumption ...
    });
});


server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});



