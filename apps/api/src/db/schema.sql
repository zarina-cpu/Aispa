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
