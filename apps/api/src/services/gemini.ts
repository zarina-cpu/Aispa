import { GoogleGenAI } from "@google/genai";
import { getGeminiApiKey, getGeminiModels } from "../config/env.js";
import { SPA_CAPTION_SYSTEM_INSTRUCTION } from "../prompts/spaCaptionSystem.js";
import { buildUserPrompt } from "../prompts/buildUserPrompt.js";
import type { GenerateFields } from "../middleware/validateGenerate.js";

export type ImageInput = {
  mimeType: string;
  data: Buffer;
};

function getClient(): GoogleGenAI {
  return new GoogleGenAI({ apiKey: getGeminiApiKey() });
}

function extractJsonText(raw: string): string {
  const trimmed = raw.trim();
  const fence = /^```(?:json)?\s*([\s\S]*?)```$/i.exec(trimmed);
  if (fence) return fence[1].trim();
  return trimmed;
}

function parseVariants(text: string): string[] {
  const jsonStr = extractJsonText(text);
  const parsed = JSON.parse(jsonStr) as { variants?: unknown };
  if (!Array.isArray(parsed.variants)) {
    throw new Error("Ответ модели не содержит массив variants");
  }
  const variants = parsed.variants
    .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
    .map((v) => v.trim());
  if (variants.length < 3) {
    throw new Error("Недостаточно вариантов в ответе модели");
  }
  return variants.slice(0, 5);
}

async function callGemini(
  client: GoogleGenAI,
  userPrompt: string,
  image?: ImageInput
): Promise<string> {
  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> =
    [{ text: userPrompt }];

  if (image) {
    parts.unshift({
      inlineData: {
        mimeType: image.mimeType,
        data: image.data.toString("base64"),
      },
    });
  }

  const models = getGeminiModels();
  let lastError: unknown;
  for (const model of models) {
    try {
      const response = await client.models.generateContent({
        model,
        contents: [{ role: "user", parts }],
        config: {
          systemInstruction: SPA_CAPTION_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("Пустой ответ от Gemini");
      }
      return text;
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      const retryable =
        msg.includes("UNAVAILABLE") ||
        msg.includes("NOT_FOUND") ||
        msg.includes("no longer available");
      if (!retryable) throw err;
    }
  }
  throw formatGeminiError(lastError, models);
}

function extractGoogleErrorMessage(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("{")) return raw;
  try {
    const parsed = JSON.parse(trimmed) as { error?: { message?: string } };
    return parsed.error?.message ?? raw;
  } catch {
    return raw;
  }
}

function formatGeminiError(err: unknown, models: string[]): Error {
  const raw = err instanceof Error ? err.message : String(err);
  const apiMessage = extractGoogleErrorMessage(raw);

  if (apiMessage.includes("high demand") || apiMessage.includes("UNAVAILABLE")) {
    return new Error(
      "Сервис Gemini временно перегружен. Подождите минуту и нажмите «Перегенерировать» или укажите в apps/api/.env: GEMINI_MODEL=gemini-3.5-flash-lite"
    );
  }
  if (apiMessage.includes("no longer available") || apiMessage.includes("NOT_FOUND")) {
    return new Error(
      `Модель недоступна (${models.join(" → ")}). Укажите GEMINI_MODEL=gemini-3.5-flash-lite в apps/api/.env и перезапустите сервер.`
    );
  }
  return new Error(apiMessage);
}

export async function generateCaptions(
  fields: GenerateFields,
  image?: ImageInput
): Promise<string[]> {
  const client = getClient();
  const hasImage = Boolean(image);
  const userPrompt = buildUserPrompt(fields, hasImage);

  try {
    const raw = await callGemini(client, userPrompt, image);
    return parseVariants(raw);
  } catch (firstError) {
    const retryPrompt =
      userPrompt +
      "\n\nВажно: верни строго JSON {\"variants\":[\"...\",\"...\",\"...\",\"...\"]} без другого текста.";
    try {
      const raw = await callGemini(client, retryPrompt, image);
      return parseVariants(raw);
    } catch {
      throw firstError;
    }
  }
}
