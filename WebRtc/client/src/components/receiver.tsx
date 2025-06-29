import { useEffect } from "react"

export function Receiver(){
        useEffect(()=>{
                        const socket = new WebSocket('ws://localhost:8080')
                        socket.onopen = () => {
                                socket.send(JSON.stringify({type:"receiver"}))
                        }

                        socket.onmessage  =async (event)=>{
                                const message = JSON.parse(event.data)
                                console.log(message.type ,message.type=='createOffer' )
                                if (message.type=='createOffer'){
                                        // initialze rtpcr connection

                                        const pc  =  new RTCPeerConnection()

                                        await pc.setRemoteDescription(message.sdp)

                                        // create answer
                                        const answer =await pc.createAnswer()

                                        // set local desc ans anser
                                        await pc.setLocalDescription(answer)
                                        
                                        // send anser to signaling server
                                        socket.send(JSON.stringify({
                                                type:"createAnswer",
                                                sdp:pc.localDescription
                                        }))

                                }
                        }
                },[])
        return(
                <div>
                       Receiver
                </div>
        )
}