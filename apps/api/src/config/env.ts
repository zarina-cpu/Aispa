import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

/** Список моделей по приоритету; переопределяется через GEMINI_MODEL (одна модель). */
export function getGeminiModels(): string[] {
  const override = process.env.GEMINI_MODEL?.trim();
  if (override) return [override];
  return ["gemini-3.8-flash", "gemini-3.5-flash-lite"];
}

export function getGeminiApiKey(): string {
  const raw =
    process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY ?? "";
  const key = raw.trim().replace(/^['"]|['"]$/g, "");

  if (!key || key.includes("your_gemini") || key.includes("your-api-key")) {
    throw new Error(
      "Укажите действующий GOOGLE_API_KEY (или GEMINI_API_KEY) в apps/api/.env"
    );
  }
  return key;
}
