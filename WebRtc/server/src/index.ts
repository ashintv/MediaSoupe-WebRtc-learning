import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let senderSocket: null | WebSocket = null;
let reciverSocket: null | WebSocket = null;
wss.on("connection", (ws) => {
    console.log('user connected')
    ws.on("message", (data: any) => {
        const message = JSON.parse(data);
        console.log(message)
        if (message.type == "sender") {
            senderSocket = ws;
        } else if (message.type == "receiver") {
            reciverSocket = ws;
        } else if (message.type == "createOffer") {
            if (ws != senderSocket) {
                return;
            }
            reciverSocket?.send(
                JSON.stringify({ type: "createOffer", sdp: message.sdp })
            );
        } else if (message.type == "createAnswer") {
            if (ws != reciverSocket) {
                return;
            }
            senderSocket?.send(
                JSON.stringify({ type: "answer", sdp: message.sdp })
            );
        } else if (message.type == "IceCanditate") {
            if (ws == senderSocket) {
                reciverSocket?.send(
                    JSON.stringify({
                        type: "IceCandiate",
                        candidate: message.candidate,
                    })
                );
            } else if (ws == reciverSocket) {
                senderSocket?.send(
                    JSON.stringify({
                        type: "IceCandiate",
                        candidate: message.candidate,
                    })
                );
            }
        }
    });
});
