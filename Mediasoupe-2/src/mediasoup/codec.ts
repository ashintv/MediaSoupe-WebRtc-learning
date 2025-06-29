import mediasoup from "mediasoup";

export const mediaCodecs: mediasoup.types.RtpCodecCapability[] = [
    {
        kind: "audio",
        mimeType: "audio/opus",
        clockRate: 48000,
        channels: 2,
        preferredPayloadType: 96,
        rtcpFeedback: [
            {
                type: "nack",
            },
            {
                type: "nack",
                parameter: "pli",
            },
        ],
    },
    {
        kind: "video",
        mimeType: "video/VP8",
        clockRate: 90000,
        parameters: {
            "x-google-start-bitrate": 1000,
        },
        preferredPayloadType: 97, // Example value
        rtcpFeedback: [
            // Example values
            { type: "nack" },
            { type: "ccm", parameter: "fir" },
            { type: "goog-remb" },
        ],
    },
];
