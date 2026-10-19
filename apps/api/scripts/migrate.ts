import "../src/config/env.js";
import { ensureSchema } from "../src/db/client.js";

await ensureSchema();
console.log("Turso schema applied.");
