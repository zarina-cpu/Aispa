import { Router } from "express";
import { isDbConfigured } from "../db/client.js";
import { listRecentGenerations } from "../repositories/generations.js";

export const historyRouter = Router();

historyRouter.get("/history", async (req, res) => {
  if (!isDbConfigured()) {
    return res.json({ items: [], dbConfigured: false });
  }

  const limit = Number(req.query.limit ?? 20);
  try {
    const items = await listRecentGenerations(
      Number.isFinite(limit) ? limit : 20
    );
    return res.json({ items, dbConfigured: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ошибка чтения истории";
    return res.status(500).json({ error: message });
  }
});
