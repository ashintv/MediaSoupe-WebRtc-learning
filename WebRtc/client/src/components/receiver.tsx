import { useEffect, useRef } from "react"

export function Receiver() {
        const videoRef = useRef<HTMLVideoElement>(null)
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

                                        if (videoRef.current) {
                                                console.log('video showing')
                                                videoRef.current.srcObject = new MediaStream([event.track])
                                                videoRef.current.play()
                                        }
                                }
                                await pc.setRemoteDescription(message.sdp)
                                // create answer
                                const answer = await pc.createAnswer()


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
                       <video ref={videoRef} src=""></video>
                </div>
        )
}