import { useState, useCallback, useRef } from "react";

export function useCamera() {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const startCamera = useCallback(async (facingMode: "user" | "environment" = "user") => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode,
                    width: { ideal: 960 },
                    height: { ideal: 540 },
                    frameRate: { ideal: 24, max: 30 }
                },
                audio: false
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            return mediaStream;
        } catch (err: any) {
            setError(err.message);
            return null;
        }
    }, []);

    const stopCamera = useCallback(() => {
        setStream((currentStream) => {
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
            }
            return null;
        });
    }, []);

    return { stream, error, videoRef, startCamera, stopCamera };
}
