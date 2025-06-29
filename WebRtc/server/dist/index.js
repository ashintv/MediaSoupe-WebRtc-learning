"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let senderSocket = null;
let reciverSocket = null;
wss.on("connection", (ws) => {
    console.log('user connected');
    ws.on("message", (data) => {
        const message = JSON.parse(data);
        console.log(message);
        if (message.type == "sender") {
            senderSocket = ws;
        }
        else if (message.type == "reciever") {
            reciverSocket = ws;
        }
        else if (message.type == "createOffer") {
            if (ws != senderSocket) {
                return;
            }
            reciverSocket === null || reciverSocket === void 0 ? void 0 : reciverSocket.send(JSON.stringify({ type: "creatOffer", sdp: message.sdp }));
        }
        else if (message.type == "createAnswer") {
            if (ws != reciverSocket) {
                return;
            }
            senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: "answer", sdp: message.sdp }));
        }
        else if (message.type == "IceCanditate") {
            if (ws == senderSocket) {
                reciverSocket === null || reciverSocket === void 0 ? void 0 : reciverSocket.send(JSON.stringify({
                    type: "IceCandiate",
                    candidate: message.candidate,
                }));
            }
            else if (ws == reciverSocket) {
                senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({
                    type: "IceCandiate",
                    candidate: message.candidate,
                }));
            }
        }
    });
});
