import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@libsql/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const url = process.env.TURSO_DATABASE_URL;
const token = process.env.TURSO_AUTH_TOKEN;

if (!url || !token) {
  console.log(JSON.stringify({ ok: false, reason: "missing_env" }));
  process.exit(1);
}

try {
  const db = createClient({ url, authToken: token });
  const r = await db.execute("SELECT COUNT(*) AS c FROM generations");
  console.log(
    JSON.stringify({
      ok: true,
      urlHost: url.replace(/^libsql:\/\//, "").split("/")[0],
      count: r.rows[0]?.c ?? r.rows[0],
    })
  );
} catch (e) {
  console.log(
    JSON.stringify({
      ok: false,
      message: e instanceof Error ? e.message : String(e),
      code: e?.code,
    })
  );
  process.exit(1);
}
