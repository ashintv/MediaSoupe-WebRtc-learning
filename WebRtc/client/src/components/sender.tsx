import { useEffect, useState } from "react"

export function Sender(){
        const [socket , setSocket ] = useState<WebSocket | null>(null)
        useEffect(()=>{
                const socket = new WebSocket('ws://localhost:8080')
                socket.onopen = () => {
                        socket.send(JSON.stringify({type:"sender"}))
                }
        },[])
        async function SendVideo(){
                //create offer
                const pc = new RTCPeerConnection() // create an RTCPeerConnection
                const offer =await  pc.createOffer() // create an offer
                await pc.setLocalDescription(offer)  // set local desc as an offer

                // send offer through signaling server (Websockets)
                socket?.send(JSON.stringify({
                        type:'createOffer',
                        sdp:pc.localDescription
                }))

        }
        return(
                <div>
                        Sender
                        <button onClick={SendVideo}>Start Send</button>
                </div>
        )
}