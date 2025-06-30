import { useEffect } from "react"

export function Receiver() {
        useEffect(() => {
                const socket = new WebSocket('ws://localhost:8080')
                socket.onopen = () => {
                        socket.send(JSON.stringify({ type: "receiver" }))
                }

                socket.onmessage = async (event) => {
                        const message = JSON.parse(event.data)
                        console.log(message)
                        let pc: RTCPeerConnection | null = null
                        if (message.type == 'createOffer') {
                                // initialze rtpcr connection
                                pc = new RTCPeerConnection()
                                pc.ontrack = (event) => {
                                        console.log('🎥 Received track:', event.track);
                                        console.log('📦 From streams:', event.streams);
                                }
                                await pc.setRemoteDescription(message.sdp)
                                // create answer
                                const answer = await pc.createAnswer()

                                pc.ontrack = (event) => {
                                        console.log('🎥 Received track:', event.track);
                                        console.log('📦 From streams:', event.streams);
                                }
                                // set local desc ans anser
                                await pc.setLocalDescription(answer)
                                pc.onicecandidate = (event) => {
                                        if (event.candidate) {
                                                socket.send(JSON.stringify({ type: 'IceCandidate', candidate: event.candidate }))
                                        }
                                }

                                // send anser to signaling server
                                socket.send(JSON.stringify({
                                        type: "createAnswer",
                                        sdp: pc.localDescription
                                }))
                        } else if (message.type === "IceCandidate") {
                                if (pc !== null) {
                                        //@ts-ignore
                                        pc.addIceCandidate(message.candidate)
                                        console.log('added ice candiate')
                                }
                        }
                }
        }, [])
        return (
                <div>
                        Receiver
                </div>
        )
}