import { Router } from "express";
import multer from "multer";
import {
  parseGenerateBody,
  requireContent,
} from "../middleware/validateGenerate.js";
import { saveGeneration } from "../repositories/generations.js";
import { generateCaptions } from "../services/gemini.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Допустимы только JPEG, PNG и WebP"));
    }
  },
});

export const generateRouter = Router();

generateRouter.post(
  "/generate",
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ error: "Файл больше 4 МБ" });
        }
        return res.status(400).json({ error: err.message });
      }
      if (err) {
        return res.status(400).json({ error: (err as Error).message });
      }
      next();
    });
  },
  async (req, res) => {
    const parsed = parseGenerateBody(req.body as Record<string, unknown>);
    if (parsed.success === false) {
      return res.status(400).json({ error: parsed.error });
    }

    const file = req.file;
    const contentError = requireContent(parsed.data.description, Boolean(file));
    if (contentError) {
      return res.status(400).json({ error: contentError });
    }

    try {
      const image = file
        ? { mimeType: file.mimetype, data: file.buffer }
        : undefined;
      const variants = await generateCaptions(parsed.data, image);
      const generationId = await saveGeneration(
        parsed.data,
        variants,
        Boolean(file)
      );
      return res.json({ variants, generationId });
    } catch (e) {
      let message = e instanceof Error ? e.message : "Ошибка генерации";
      if (message.includes("API_KEY_INVALID") || message.includes("API key not valid")) {
        message =
          "Ключ Gemini не принят. Сохраните действующий ключ в apps/api/.env (GOOGLE_API_KEY=AIza...), перезапустите npm run dev. Создайте новый ключ в Google AI Studio, если старый удалён или ограничен.";
      }
      const status =
        message.includes("GOOGLE_API_KEY") ||
        message.includes("GEMINI_API_KEY") ||
        message.includes("apps/api/.env") ||
        message.includes("Ключ Gemini")
          ? 503
          : 502;
      return res.status(status).json({ error: message });
    }
  }
);
