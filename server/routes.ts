import type { Express } from "express";
import type { Server } from "http";
import multer from "multer";
import { translateSign, generateSignPose } from "./gemini.js";
import { setupLiveWebSocket } from "./liveSign.js";

// Setup multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {

  app.post("/api/translate", upload.single("video"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: "No video provided" });
      }

      const { targetLanguage } = req.body;
      const text = await translateSign(req.file.buffer, targetLanguage || "Thai");

      res.json({ success: true, translatedText: text });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // DYNAMIC SIGN GENERATION (Gemini powered)
  app.post("/api/sign-gen", async (req, res) => {
    try {
      const { word } = req.body;
      if (!word) return res.status(400).json({ error: "No word provided" });

      const poseData = await generateSignPose(word);
      res.json({ success: true, poseData });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // VIDEO PROXY (Super Proxy with Browser Mimicry)
  app.get("/api/video-proxy", async (req, res) => {
    try {
      const { url } = req.query;
      if (!url || typeof url !== "string") return res.status(400).send("No URL provided");

      // Mimic a real browser request to bypass 403 Forbidden
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Referer": new URL(url).origin,
          "Accept": "video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5",
          "Connection": "keep-alive"
        }
      });

      if (!response.ok) {
        console.error(`Proxy Failed for ${url}: ${response.status} ${response.statusText}`);
        return res.status(response.status).send(`External source error: ${response.status}`);
      }

      res.setHeader("Content-Type", response.headers.get("Content-Type") || "video/mp4");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.setHeader("Accept-Ranges", "bytes");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Could not get reader");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(Buffer.from(value));
      }
      res.end();
    } catch (error: any) {
      console.error("Video Proxy Error:", error);
      res.status(500).send(error.message);
    }
  });

  // SPREADTHESIGN SEARCH API (Two-Step Deep Scraper)
  app.get("/api/sign-search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") return res.status(400).send("No query provided");

      const baseUrl = "https://www.spreadthesign.com";
      const searchUrl = `${baseUrl}/en.gb/search/?q=${encodeURIComponent(q)}`;

      const searchResponse = await fetch(searchUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
      });
      const searchHtml = await searchResponse.text();

      const wordLinkMatch = searchHtml.match(/href="(\/en\.gb\/word\/[^"]+)"/);

      if (!wordLinkMatch) {
        const directMatch = searchHtml.match(/(https?:)?\/\/media\.spreadthesign\.com\/video\/mp4\/[^"'\\s<]+\.mp4/);
        if (directMatch && directMatch[0]) {
          const videoUrl = directMatch[0].startsWith("http") ? directMatch[0] : `https:${directMatch[0]}`;
          return res.json({ success: true, videoUrl, source: "Spreadthesign" });
        }
        return res.status(404).json({ success: false, error: "ไม่พบคำศัพท์นี้ในฐานข้อมูล" });
      }

      const detailUrl = baseUrl + wordLinkMatch[1];
      const detailResponse = await fetch(detailUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
      });
      const detailHtml = await detailResponse.text();

      const videoMatch = detailHtml.match(/(https?:)?\/\/media\.spreadthesign\.com\/video\/mp4\/[^"'\\s<]+\.mp4/);

      if (videoMatch && videoMatch[0]) {
        const videoUrl = videoMatch[0].startsWith("http") ? videoMatch[0] : `https:${videoMatch[0]}`;
        res.json({
          success: true,
          videoUrl,
          source: "Spreadthesign Database"
        });
      } else {
        res.status(404).json({ success: false, error: "ไม่พบวิดีโอสำหรับคำนี้ (อาจเป็นเพราะหน้าเว็บเปลี่ยนรูปแบบ)" });
      }
    } catch (error: any) {
      console.error("Deep Search Error:", error);
      res.status(500).json({ success: false, error: "เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์" });
    }
  });

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  // Setup Gemini Live WebSocket
  setupLiveWebSocket(httpServer);

  return httpServer;
}
