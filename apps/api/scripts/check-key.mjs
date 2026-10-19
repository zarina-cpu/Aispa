import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const raw =
  process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY ?? "";
const k = raw.trim().replace(/^['"]|['"]$/g, "");
const issues = [];
if (!k) issues.push("empty");
if (k.includes("your_gemini") || k.includes("your-api-key"))
  issues.push("placeholder");
if (raw !== k) issues.push("had_quotes_or_spaces");
if (!/^AIza[\w-]+$/.test(k)) issues.push("unexpected_format");

console.log(
  JSON.stringify({
    len: k.length,
    prefix: k.slice(0, 4),
    issues,
    vars: {
      GOOGLE_API_KEY: Boolean(process.env.GOOGLE_API_KEY),
      GEMINI_API_KEY: Boolean(process.env.GEMINI_API_KEY),
    },
  })
);

if (issues.length === 0) {
  const model = process.env.GEMINI_MODEL?.trim() || "gemini-3.8-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(k)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: "Say OK" }] }],
    }),
  });
  const body = await res.text();
  console.log(
    JSON.stringify({
      httpStatus: res.status,
      ok: res.ok,
      snippet: body.slice(0, 200),
    })
  );
}
