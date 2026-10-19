import { createClient, type Client } from "@libsql/client";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let client: Client | null = null;
let schemaReady = false;

export function isDbConfigured(): boolean {
  return Boolean(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);
}

export function getDb(): Client | null {
  if (!isDbConfigured()) return null;
  if (!client) {
    client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
  }
  return client;
}

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS generations (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  description TEXT NOT NULL DEFAULT '',
  tone TEXT NOT NULL,
  length TEXT NOT NULL,
  add_emoji INTEGER NOT NULL DEFAULT 0,
  add_hashtags INTEGER NOT NULL DEFAULT 0,
  add_cta INTEGER NOT NULL DEFAULT 0,
  had_image INTEGER NOT NULL DEFAULT 0,
  variants_json TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations (created_at DESC);
`;

export async function ensureSchema(): Promise<void> {
  if (schemaReady) return;
  const db = getDb();
  if (!db) return;
  try {
    await db.executeMultiple(SCHEMA_SQL);
  } catch {
    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = readFileSync(schemaPath, "utf8");
    await db.executeMultiple(schema);
  }
  schemaReady = true;
}
