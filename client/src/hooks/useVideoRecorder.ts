import { useState, useCallback, useRef } from "react";

export function useVideoRecorder(stream: MediaStream | null) {
    const [isRecording, setIsRecording] = useState(false);
    const [recordTime, setRecordTime] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const resolveRef = useRef<((value: Blob | PromiseLike<Blob>) => void) | null>(null);

    const startRecording = useCallback((durationMs?: number): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            if (!stream) return reject("No stream available");

            const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp8" });
            mediaRecorderRef.current = recorder;
            chunksRef.current = [];
            resolveRef.current = resolve;

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "video/webm" });
                setIsRecording(false);
                if (timerRef.current) clearInterval(timerRef.current);
                if (resolveRef.current) resolveRef.current(blob);
            };

            recorder.start();
            setIsRecording(true);
            setRecordTime(0);

            const startTime = Date.now();
            timerRef.current = setInterval(() => {
                const elapsed = Math.round((Date.now() - startTime) / 1000);
                setRecordTime(elapsed);
            }, 1000);

            // Optional fixed duration
            if (durationMs) {
                setTimeout(() => {
                    if (recorder.state === "recording") {
                        recorder.stop();
                    }
                }, durationMs);
            }
        });
    }, [stream]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
        }
    }, []);

    return { isRecording, recordTime, startRecording, stopRecording };
}
