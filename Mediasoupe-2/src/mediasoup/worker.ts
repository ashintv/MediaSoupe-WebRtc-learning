import { Consumer } from 'mediasoup/node/lib/ConsumerTypes';
import mediasoup from "mediasoup"


let producerTransport : mediasoup.types.WebRtcTransport<mediasoup.types.AppData> | undefined
let consumerTransport : mediasoup.types.WebRtcTransport<mediasoup.types.AppData> | undefined

let producer: mediasoup.types.Producer<mediasoup.types.AppData> | undefined;
let consumer: mediasoup.types.Consumer<mediasoup.types.AppData> | undefined;


const createWorker = async (): Promise<mediasoup.types.Worker<mediasoup.types.AppData>> => {
  // Create a mediasoup worker with specific configuration
  const newWorker = await mediasoup.createWorker({
    rtcMinPort: 2000, // Minimum port number for RTC traffic
    rtcMaxPort: 2020, // Maximum port number for RTC traffic
  });

  // Log the worker process ID for reference
  console.log(`Worker process ID ${newWorker.pid}`);

  // Event handler for the 'died' event on the worker
  newWorker.on("died", (error) => {
    console.error("mediasoup worker has died");
    // Gracefully shut down the process to allow for recovery or troubleshooting
    setTimeout(() => {
      process.exit();
    }, 2000);
  });

  return newWorker;
}