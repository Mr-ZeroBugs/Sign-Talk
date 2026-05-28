import { GoogleGenAI, Modality } from "@google/genai";
import type { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const LIVE_MODEL = "gemini-2.5-flash-native-audio-latest";

const SYSTEM_PROMPT = `You are a Sign Language interpreter (ASL and TSL - Thai Sign Language).

You receive video frames from a live camera stream. Analyze the hand shapes and movements.

Rules:
- If you detect sign language gestures, translate to Thai text.
- Output ONLY the translated Thai word or phrase. Nothing else. No punctuation. No explanation.
- If no clear sign is visible, output nothing at all.
- Keep it short and direct.`;

export function setupLiveWebSocket(httpServer: Server) {
    const wss = new WebSocketServer({ server: httpServer, path: "/ws/live-sign" });

    wss.on("connection", async (clientWs: WebSocket) => {
        console.log("[Live Sign] Client connected");

        let geminiSession: any = null;

        const cleanup = () => {
            try { geminiSession?.close(); } catch (_) { }
            geminiSession = null;
        };

        try {
            geminiSession = await ai.live.connect({
                model: LIVE_MODEL,
                config: {
                    responseModalities: [Modality.AUDIO],
                    outputAudioTranscription: {},
                    systemInstruction: {
                        parts: [{ text: SYSTEM_PROMPT }]
                    }
                },
                callbacks: {
                    onopen: () => {
                        console.log(`[Live Sign] Gemini session OPEN (${LIVE_MODEL})`);
                        if (clientWs.readyState === WebSocket.OPEN) {
                            clientWs.send(JSON.stringify({ type: "ready" }));
                        }
                    },
                    onmessage: (msg: any) => {
                        const text =
                            msg?.serverContent?.outputTranscription?.text?.trim() ||
                            msg?.text?.trim();
                        console.log("[Live Sign] Gemini msg, text:", text || "(empty)");

                        if (text && clientWs.readyState === WebSocket.OPEN) {
                            console.log("[Live Sign] Sending translation:", text);
                            clientWs.send(JSON.stringify({ type: "translation", text }));
                        }
                    },
                    onerror: (e: any) => {
                        console.error("[Live Sign] Gemini error:", e);
                        if (clientWs.readyState === WebSocket.OPEN) {
                            clientWs.send(JSON.stringify({ type: "error", message: String(e) }));
                        }
                    },
                    onclose: (e: any) => {
                        console.log("[Live Sign] Gemini session CLOSED:", e);
                        geminiSession = null;
                        if (clientWs.readyState === WebSocket.OPEN) {
                            clientWs.send(JSON.stringify({ type: "error", message: `Gemini live session closed${e?.reason ? `: ${e.reason}` : ""}` }));
                        }
                    },
                }
            });

        } catch (err: any) {
            console.error("[Live Sign] Failed to connect Gemini Live:", err);
            if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({ type: "error", message: err.message }));
            }
            clientWs.close();
            return;
        }

        // Receive frames from client
        clientWs.on("message", (data: Buffer) => {
            try {
                const msg = JSON.parse(data.toString());

                if (msg.type === "frame" && geminiSession) {
                    console.log("[Live Sign] Got frame, sending to Gemini via sendRealtimeInput...");
                    geminiSession.sendRealtimeInput({
                        media: {
                            data: msg.data,
                            mimeType: "image/jpeg",
                        },
                    });
                } else if (msg.type === "frame") {
                    console.warn("[Live Sign] Dropping frame because Gemini session is not active");
                    if (clientWs.readyState === WebSocket.OPEN) {
                        clientWs.send(JSON.stringify({ type: "error", message: "Gemini session is not active" }));
                    }
                } else if (msg.type === "stop") {
                    cleanup();
                }
            } catch (e) {
                console.error("[Live Sign] Parse error:", e);
            }
        });

        clientWs.on("close", () => {
            console.log("[Live Sign] Client disconnected");
            cleanup();
        });

        clientWs.on("error", (err) => {
            console.error("[Live Sign] WS error:", err);
            cleanup();
        });
    });

    console.log("[Live Sign] WebSocket ready at ws://localhost:PORT/ws/live-sign");
    return wss;
}
