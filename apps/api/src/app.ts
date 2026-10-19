import cors from "cors";
import express from "express";
import { getGeminiApiKey } from "./config/env.js";
import { generateRouter } from "./routes/generate.js";
import { historyRouter } from "./routes/history.js";

export function createApp() {
  const app = express();

  const origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.FRONTEND_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    "https://aispa-caption-studio.vercel.app",
  ].filter(Boolean) as string[];

  app.use(
    cors({
      origin: origins.length > 0 ? origins : true,
    })
  );

  app.get("/api/health", (_req, res) => {
    let keyConfigured = false;
    try {
      getGeminiApiKey();
      keyConfigured = true;
    } catch {
      keyConfigured = false;
    }
    const dbConfigured = Boolean(
      process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN
    );
    res.json({ ok: true, keyConfigured, dbConfigured });
  });

  app.use("/api", generateRouter);
  app.use("/api", historyRouter);

  return app;
}
