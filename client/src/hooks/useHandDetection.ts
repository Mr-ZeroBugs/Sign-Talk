import { useEffect, useRef, useState, useCallback } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export function useHandDetection() {
    const [landmarker, setLandmarker] = useState<HandLandmarker | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const lastDetectionTimeRef = useRef(0);
    const lastVideoTimeRef = useRef(-1);
    const lastResultRef = useRef<ReturnType<HandLandmarker["detectForVideo"]> | null>(null);

    useEffect(() => {
        async function init() {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
                );
                const hl = await HandLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
                        delegate: "GPU"
                    },
                    runningMode: "VIDEO",
                    numHands: 1
                });
                setLandmarker(hl);
                setIsLoading(false);
            } catch (err) {
                console.error("Failed to load HandLandmarker:", err);
            }
        }
        init();
    }, []);

    const detect = useCallback((video: HTMLVideoElement) => {
        if (!landmarker || video.readyState < 2) return null;

        const now = performance.now();
        const minDetectionIntervalMs = 100;

        if (video.currentTime === lastVideoTimeRef.current) {
            return lastResultRef.current;
        }

        if (now - lastDetectionTimeRef.current < minDetectionIntervalMs) {
            return lastResultRef.current;
        }

        lastVideoTimeRef.current = video.currentTime;
        lastDetectionTimeRef.current = now;
        lastResultRef.current = landmarker.detectForVideo(video, now);

        return lastResultRef.current;
    }, [landmarker]);

    return { landmarker, isLoading, detect };
}
