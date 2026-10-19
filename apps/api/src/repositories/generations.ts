import { randomUUID } from "crypto";
import { ensureSchema, getDb } from "../db/client.js";
import type { GenerateFields } from "../middleware/validateGenerate.js";

export type GenerationRow = {
  id: string;
  created_at: string;
  description: string;
  tone: string;
  length: string;
  add_emoji: number;
  add_hashtags: number;
  add_cta: number;
  had_image: number;
  variants_json: string;
};

export async function saveGeneration(
  fields: GenerateFields,
  variants: string[],
  hadImage: boolean
): Promise<string | null> {
  const db = getDb();
  if (!db) return null;
  await ensureSchema();

  const id = randomUUID();
  await db.execute({
    sql: `INSERT INTO generations (
      id, description, tone, length, add_emoji, add_hashtags, add_cta, had_image, variants_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      fields.description ?? "",
      fields.tone,
      fields.length,
      fields.addEmoji ? 1 : 0,
      fields.addHashtags ? 1 : 0,
      fields.addCta ? 1 : 0,
      hadImage ? 1 : 0,
      JSON.stringify(variants),
    ],
  });
  return id;
}

export async function listRecentGenerations(
  limit = 20
): Promise<
  Array<{
    id: string;
    createdAt: string;
    description: string;
    tone: string;
    length: string;
    variants: string[];
    hadImage: boolean;
  }>
> {
  const db = getDb();
  if (!db) return [];
  await ensureSchema();

  const capped = Math.min(Math.max(limit, 1), 50);
  const result = await db.execute({
    sql: `SELECT id, created_at, description, tone, length, had_image, variants_json
          FROM generations ORDER BY created_at DESC LIMIT ?`,
    args: [capped],
  });

  return result.rows.map((row) => {
    const r = row as unknown as GenerationRow;
    let variants: string[] = [];
    try {
      variants = JSON.parse(r.variants_json) as string[];
    } catch {
      variants = [];
    }
    return {
      id: String(r.id),
      createdAt: String(r.created_at),
      description: String(r.description),
      tone: String(r.tone),
      length: String(r.length),
      hadImage: Number(r.had_image) === 1,
      variants,
    };
  });
}
