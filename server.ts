import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI Client
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // AI Agent Sandbox Chat Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { prompt, systemInstruction, model } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Missing prompt" });
      }

      if (!ai) {
        // Fallback simulated response if key not available
        return res.json({
          text: `【AI运营中心 沙箱服务】收到您的指令："${prompt}"。由于当前处于演示环境，已启动内置 Agent 模拟思考并返回响应：该任务可以成功执行！`,
        });
      }

      const modelName = model || "gemini-3.6-flash";
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: systemInstruction ? { systemInstruction } : undefined,
      });

      return res.json({
        text: response.text || "生成完成",
      });
    } catch (err: any) {
      console.error("Gemini API error:", err);
      return res.status(500).json({
        error: "AI 响应异常",
        details: err.message || String(err),
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI运营中心 服务器已启动: http://0.0.0.0:${PORT}`);
  });
}

startServer();
