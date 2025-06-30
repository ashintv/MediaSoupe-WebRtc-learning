import { useEffect, useState } from "react"

export function Sender() {
        const [socket, setSocket] = useState<WebSocket | null>(null)
        useEffect(() => {
                const socket = new WebSocket('ws://localhost:8080')
                socket.onopen = () => {
                        socket.send(JSON.stringify({ type: "sender" }))
                }
                setSocket(socket)
        }, [])
        async function SendVideo() {
                if (!socket) {
                        return
                }
                //create offer
                const pc = new RTCPeerConnection() // create an RTCPeerConnection


                pc.onnegotiationneeded = async () => {
                        const offer = await pc.createOffer() // create an offer
                        console.log('on negotiation')
                        await pc.setLocalDescription(offer)
                        socket.send(JSON.stringify({
                                type: 'createOffer',
                                sdp: pc.localDescription
                        }))  // set local desc as an offer
                }


                pc.onicecandidate = (event) => {
                        console.log("icecandidate send ice candidate")
                        if (event.candidate) {
                                socket.send(JSON.stringify({ type: 'IceCandidate', candidate: event.candidate }))
                        }
                }
                // send offer through signaling server (Websockets)


                socket.onmessage = async (event) => {
                        const message = JSON.parse(event.data)
                        console.log(message)
                        if (message.type == 'createAnswer') {
                                pc.setRemoteDescription(message.sdp)
                        }
                        else if (message.type === "IceCandidate") {
                                pc.addIceCandidate(message.candidate)
                        }
                }
                // const stream = await navigator.mediaDevices.getUserMedia({ video:true , audio:false})
                // pc.addTrack(stream.getVideoTracks()[0])
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                const videoTrack = stream.getVideoTracks()[0];

                pc.addTrack(videoTrack, stream); // ✅ include stream


        }
        return (
                <div>
                        Sender
                        <button onClick={SendVideo}>Start Send</button>
                </div>
        )
}