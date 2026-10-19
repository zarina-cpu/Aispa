import { z } from "zod";

const toneSchema = z.enum([
  "atmospheric",
  "selling",
  "expert",
  "short_aesthetic",
]);

const lengthSchema = z.enum(["short", "medium", "long"]);

function parseBool(value: unknown): boolean {
  if (value === true || value === "true" || value === "1") return true;
  if (value === false || value === "false" || value === "0") return false;
  return Boolean(value);
}

export const generateBodySchema = z.object({
  description: z.string().optional().default(""),
  tone: toneSchema,
  length: lengthSchema,
  addEmoji: z.preprocess(parseBool, z.boolean()),
  addHashtags: z.preprocess(parseBool, z.boolean()),
  addCta: z.preprocess(parseBool, z.boolean()),
});

export type GenerateFields = z.infer<typeof generateBodySchema>;

export function parseGenerateBody(
  body: Record<string, unknown>
): { success: true; data: GenerateFields } | { success: false; error: string } {
  const result = generateBodySchema.safeParse(body);
  if (!result.success) {
    const msg = result.error.errors.map((e) => e.message).join("; ");
    return { success: false, error: msg };
  }
  return { success: true, data: result.data };
}

export function requireContent(
  description: string,
  hasImage: boolean
): string | null {
  const trimmed = description.trim();
  if (!hasImage && !trimmed) {
    return "Загрузите фото или введите описание / ключевые слова.";
  }
  return null;
}
