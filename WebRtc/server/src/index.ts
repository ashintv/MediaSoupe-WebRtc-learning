import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let senderSocket: null | WebSocket = null;
let reciverSocket: null | WebSocket = null;
wss.on("connection", (ws) => {
    
    ws.on("message", (data: any) => {
        const message = JSON.parse(data);
        if (message.type === "sender") {
            senderSocket = ws;
            console.log('sender set')
        } else if (message.type === "receiver") {
            reciverSocket = ws;
            console.log('reciever set')
        } else if (message.type === "createOffer") {
            if (ws != senderSocket) {
                return;
            }
            reciverSocket?.send(
                JSON.stringify({ type: "createOffer", sdp: message.sdp })
            );
            console.log('offer recieved')
        } else if (message.type === "createAnswer") {
            if (ws != reciverSocket) {
                return;
            }
            senderSocket?.send(
                JSON.stringify({ type: "createAnswer", sdp: message.sdp })
            );
            console.log('answer recieved')
        } else if (message.type === "IceCandidate") {
            if (ws === senderSocket) {
                console.log('shared IC from sender to reciever')
                reciverSocket?.send(
                    JSON.stringify({
                        type: "IceCandidate",
                        candidate: message.candidate,
                    })
                );
            } else if (ws === reciverSocket) {
                console.log('shared IC from rec ro sender')
                senderSocket?.send(
                    JSON.stringify({
                        type: "IceCandidate",
                        candidate: message.candidate,
                    })
                );
            }
        }
    });
});
