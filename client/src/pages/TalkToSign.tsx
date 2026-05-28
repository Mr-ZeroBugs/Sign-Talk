import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const SIGN_DATA = [
    { word: "สวัสดี", video: "https://media.tenor.com/images/3a6933f7f896b02553754215d2a21156/tenor.gif", type: "image" },
    { word: "เจ็บ", video: "/Hurt.mp4", type: "video" },
    { word: "ปวด", video: "/Ache.mp4", type: "video" },
    { word: "กินยา", video: "/Medicine.mp4", type: "video" },
    { word: "ขอดูยา", video: "/drugpls.mp4", type: "video" },
    { word: "กินข้าว", video: "/Eat.mp4", type: "video" },
    { word: "ดีขึ้น", video: "/good.mp4", type: "video" },
    { word: "ชื่ออะไร", video: "/Name.mp4", type: "video" },
    { word: "ช้าลง", video: "/Slow.mp4", type: "video" },
    { word: "ขอบคุณ", video: "https://media.tenor.com/images/a3928827727101869877114777553313/tenor.gif", type: "image" },
];

export default function TalkToSign() {
    const [selected, setSelected] = useState(SIGN_DATA[0]);
    const videoRef = useRef<HTMLVideoElement>(null);

    return (
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col items-center space-y-8">
            <div className="w-full relative rounded-[56px] overflow-hidden bg-slate-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] border-8 border-white" style={{ aspectRatio: "16/9" }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selected.word}
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.35 }}
                        className="w-full h-full absolute inset-0"
                    >
                        {selected.type === "video" ? (
                            <video ref={videoRef} src={selected.video} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                        ) : (
                            <img src={selected.video} alt={selected.word} className="w-full h-full object-cover" />
                        )}
                    </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={selected.word + "_label"}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute top-8 left-8 pointer-events-none"
                    >
                        <div className="bg-white/90 backdrop-blur-2xl px-8 py-4 rounded-[32px] shadow-lg border border-white">
                            <p className="text-4xl font-black text-slate-900 tracking-tight">{selected.word}</p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="w-full grid grid-cols-5 md:grid-cols-10 gap-3">
                {SIGN_DATA.map((item) => (
                    <button
                        key={item.word}
                        onClick={() => setSelected(item)}
                        className={cn(
                            "h-20 rounded-[28px] flex items-center justify-center font-black text-base transition-all border-4",
                            selected.word === item.word
                                ? "bg-slate-900 text-white border-slate-900 shadow-xl scale-105"
                                : "bg-white text-slate-400 border-white hover:bg-slate-50 shadow-sm hover:scale-105"
                        )}
                    >
                        {item.word}
                    </button>
                ))}
            </div>
        </div>
    );
}
