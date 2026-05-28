import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Mic, MicOff, RefreshCw, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCamera } from "@/hooks/useCamera";
import { useHandDetection } from "@/hooks/useHandDetection";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useVideoRecorder } from "@/hooks/useVideoRecorder";

type ChatMessage = {
    id: number;
    speaker: "signer" | "speaker";
    text: string;
};

export default function Translate() {
    const { stream, startCamera, stopCamera, videoRef } = useCamera();
    const { isLoading: isLoadingModel, detect } = useHandDetection();
    const { isRecording, recordTime, startRecording, stopRecording } = useVideoRecorder(stream);
    const { speak } = useTextToSpeech();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nextMessageIdRef = useRef(1);
    const lastHandTimeRef = useRef<number>(Date.now());
    const handDetectedRef = useRef<boolean>(false);

    const [translatedText, setTranslatedText] = useState("");
    const [isTranslating, setIsTranslating] = useState(false);
    const [isHearingListening, setIsHearingListening] = useState(false);
    const [hearingResponse, setHearingResponse] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const appendMessage = useCallback((speaker: ChatMessage["speaker"], text: string) => {
        const trimmed = text.trim();
        if (!trimmed) return;

        setMessages((current) => [
            ...current,
            {
                id: nextMessageIdRef.current++,
                speaker,
                text: trimmed,
            },
        ]);
    }, []);

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, [startCamera, stopCamera]);

    useEffect(() => {
        if (!stream || !canvasRef.current || !videoRef.current) return;

        let animationFrameId: number;
        const ctx = canvasRef.current.getContext("2d");

        const render = () => {
            if (videoRef.current && canvasRef.current && ctx) {
                const results = detect(videoRef.current);
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

                if (results?.landmarks && results.landmarks.length > 0) {
                    handDetectedRef.current = true;
                    lastHandTimeRef.current = Date.now();

                    for (const landmarks of results.landmarks) {
                        ctx.fillStyle = "#fff7ed";
                        ctx.strokeStyle = "#fb923c";
                        ctx.lineWidth = 4;

                        const connections = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17]];
                        connections.forEach(([i, j]) => {
                            ctx.beginPath();
                            ctx.moveTo(landmarks[i].x * canvasRef.current!.width, landmarks[i].y * canvasRef.current!.height);
                            ctx.lineTo(landmarks[j].x * canvasRef.current!.width, landmarks[j].y * canvasRef.current!.height);
                            ctx.stroke();
                        });

                        landmarks.forEach((lm) => {
                            ctx.beginPath();
                            ctx.arc(lm.x * canvasRef.current!.width, lm.y * canvasRef.current!.height, 4, 0, 2 * Math.PI);
                            ctx.fill();
                            ctx.stroke();
                        });
                    }
                } else if (isRecording && handDetectedRef.current) {
                    if (Date.now() - lastHandTimeRef.current > 1500) {
                        stopRecording();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, [stream, detect, videoRef, isRecording, stopRecording]);

    const handleToggleRecording = useCallback(() => {
        if (isRecording) {
            stopRecording();
            return;
        }

        setTranslatedText("");
        setHearingResponse("");
        handDetectedRef.current = false;

        startRecording()
            .then(async (videoBlob) => {
                setIsTranslating(true);

                const formData = new FormData();
                formData.append("video", videoBlob, "sign.webm");
                formData.append("targetLanguage", "Thai");

                const response = await fetch("/api/translate", { method: "POST", body: formData });
                const data = await response.json();

                if (data.success) {
                    const text = (data.translatedText || "").trim();
                    if (text && text !== "ไม่พบท่าทาง") {
                        setTranslatedText(text);
                        appendMessage("signer", text);
                        speak(text);
                    } else {
                        setTranslatedText("");
                    }
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setIsTranslating(false);
            });
    }, [appendMessage, isRecording, speak, startRecording, stopRecording]);

    const toggleHearingSpeech = useCallback(() => {
        const SRClass = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        if (!SRClass) return;

        if (isHearingListening) {
            setIsHearingListening(false);
            return;
        }

        const recognition = new SRClass();
        recognition.lang = "th-TH";
        recognition.onstart = () => setIsHearingListening(true);
        recognition.onend = () => setIsHearingListening(false);
        recognition.onresult = (event: any) => {
            const text = event.results[0][0].transcript;
            setHearingResponse(text);
            appendMessage("speaker", text);
        };
        recognition.start();
    }, [appendMessage, isHearingListening]);

    const replayLatestTranslation = useCallback(() => {
        if (translatedText) {
            speak(translatedText);
        }
    }, [speak, translatedText]);

    return (
        <div className="fixed inset-x-0 bottom-0 top-[72px] overflow-hidden bg-black">
            {isLoadingModel && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
                    <Loader2 className="h-12 w-12 animate-spin text-white" />
                </div>
            )}

            <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 h-full w-full object-cover scale-x-[-1]" />
            <canvas ref={canvasRef} width={960} height={540} className="pointer-events-none absolute inset-0 h-full w-full object-cover scale-x-[-1]" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_35%,_rgba(15,23,42,0.22)_100%)]" />
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/55 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-[28vh] bg-gradient-to-t from-black/80 via-black/48 to-transparent" />

            <div className="absolute left-5 top-5 flex items-center gap-2.5">
                <div className={cn("rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.28em] backdrop-blur-xl", isRecording ? "bg-red-500 text-white" : "bg-white/10 text-white border border-white/12")}>
                    {isRecording ? `Recording ${recordTime}s` : "Record Mode"}
                </div>
                {isTranslating && (
                    <div className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.28em] text-white backdrop-blur-xl">
                        Translating
                    </div>
                )}
            </div>

            <div className="absolute right-5 top-5 flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => startCamera()}
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/16"
                >
                    <RefreshCw className="h-4 w-4" />
                </button>
            </div>

            <div className="absolute inset-x-0 bottom-0 z-20 px-3 pb-3 pt-8 md:px-5 md:pb-5">
                <div className="mx-auto max-w-7xl">
                    <div className="grid items-end gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
                        <div className="rounded-[28px] border border-white/10 bg-black/24 p-4 text-white shadow-[0_24px_64px_-38px_rgba(0,0,0,0.92)] backdrop-blur-xl md:p-5">
                            <AnimatePresence mode="wait">
                                {(translatedText || hearingResponse) ? (
                                    <motion.div
                                        key={`${translatedText}-${hearingResponse}`}
                                        initial={{ opacity: 0, y: 18 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }}
                                        className="space-y-4"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-[11px] font-black uppercase tracking-[0.32em] text-orange-300">คำแปลล่าสุด</p>
                                                <p className="mt-2 text-2xl font-black leading-tight md:text-4xl">{translatedText || "..."}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={replayLatestTranslation}
                                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-400/18 text-orange-100 transition hover:bg-orange-400/26"
                                            >
                                                <Volume2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {hearingResponse && (
                                            <div className="border-t border-white/10 pt-4">
                                                <p className="text-[11px] font-black uppercase tracking-[0.32em] text-sky-300">เสียงตอบกลับล่าสุด</p>
                                                <p className="mt-2 text-base font-bold leading-relaxed text-white/90 md:text-xl">{hearingResponse}</p>
                                            </div>
                                        )}
                                    </motion.div>
                                ) : (
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-[11px] font-black uppercase tracking-[0.32em] text-orange-300">พร้อมแปล</p>
                                            <p className="mt-2 max-w-3xl text-lg font-bold leading-relaxed text-white/88 md:text-2xl">
                                                เริ่มอัดแล้วทำภาษามือหน้ากล้อง จากนั้นกดหยุดเพื่อให้ระบบสร้างคำแปล และกดไมค์เพื่อเก็บข้อความตอบกลับจากอีกฝั่ง
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </AnimatePresence>

                            <div className="mt-5 flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    disabled={isLoadingModel || isTranslating}
                                    onClick={handleToggleRecording}
                                    className={cn(
                                        "inline-flex h-14 min-w-[210px] items-center justify-center rounded-[22px] px-6 text-base font-black text-white transition-all",
                                        isRecording ? "bg-red-500 hover:bg-red-600" : "bg-white text-slate-950 hover:bg-orange-50",
                                        (isLoadingModel || isTranslating) && "cursor-not-allowed opacity-70",
                                    )}
                                >
                                    {isRecording ? "หยุดอัด" : isTranslating ? <Loader2 className="h-6 w-6 animate-spin" /> : "เริ่มอัดและแปล"}
                                </button>

                                <button
                                    type="button"
                                    onClick={toggleHearingSpeech}
                                    className={cn(
                                        "inline-flex h-14 items-center gap-3 rounded-[22px] border px-4 text-xs font-black uppercase tracking-[0.18em] text-white backdrop-blur-xl transition-all",
                                        isHearingListening ? "border-red-300 bg-red-500/90" : "border-white/15 bg-white/10 hover:bg-white/15",
                                    )}
                                >
                                    {isHearingListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                                    {isHearingListening ? "หยุดฟัง" : "ไมค์ตอบกลับ"}
                                </button>
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-white/10 bg-black/18 p-3.5 text-white shadow-[0_24px_64px_-38px_rgba(0,0,0,0.92)] backdrop-blur-xl md:p-4">
                            <div className="flex items-center justify-between gap-3 border-b border-white/8 pb-3">
                                <div>
                                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/50">History</p>
                                    <h2 className="mt-1 text-base font-black text-white">บทสนทนา</h2>
                                </div>
                                <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/70">
                                    {messages.length}
                                </div>
                            </div>

                            <div className="mt-3 flex max-h-[22vh] min-h-[130px] flex-col gap-2.5 overflow-y-auto pr-1">
                                {messages.length === 0 ? (
                                    <div className="flex min-h-[130px] items-center justify-center rounded-[22px] border border-dashed border-white/10 bg-white/5 px-4 text-center text-xs font-semibold leading-relaxed text-white/45">
                                        คำแปลและเสียงตอบกลับจะมาแสดงที่นี่
                                    </div>
                                ) : (
                                    messages.slice().reverse().map((message) => (
                                        <div
                                            key={message.id}
                                            className={cn(
                                                "rounded-[18px] px-3 py-2.5",
                                                message.speaker === "signer" ? "bg-orange-400/16" : "bg-sky-400/16",
                                            )}
                                        >
                                            <p className={cn("text-[10px] font-black uppercase tracking-[0.28em]", message.speaker === "signer" ? "text-orange-200" : "text-sky-200")}>
                                                {message.speaker === "signer" ? "Signer" : "Speaker"}
                                            </p>
                                            <p className="mt-1.5 text-xs font-bold leading-relaxed text-white/92">{message.text}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
