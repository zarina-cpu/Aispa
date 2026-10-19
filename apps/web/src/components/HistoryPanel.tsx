import { useEffect, useState } from "react";
import { fetchHistory, type HistoryItem } from "../api/history";

export function HistoryPanel() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [dbConfigured, setDbConfigured] = useState(true);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchHistory()
      .then((data) => {
        setItems(data.items);
        setDbConfigured(data.dbConfigured);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const onGenerated = () => load();
    window.addEventListener("spa-caption-generated", onGenerated);
    return () => window.removeEventListener("spa-caption-generated", onGenerated);
  }, []);

  if (!dbConfigured) {
    return (
      <section className="rounded-2xl border border-dashed border-border bg-surfaceAlt/50 p-6 text-sm text-inkMuted">
        История в Turso не настроена (локально это нормально). На Vercel добавьте{" "}
        <code className="text-xs">TURSO_DATABASE_URL</code> и{" "}
        <code className="text-xs">TURSO_AUTH_TOKEN</code>.
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-surfaceAlt p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="font-display text-xl font-semibold text-ink">
          История (Turso)
        </h2>
        <button
          type="button"
          onClick={load}
          className="text-xs text-inkMuted underline hover:text-ink"
        >
          Обновить
        </button>
      </div>
      {loading && <p className="text-sm text-inkMuted">Загрузка…</p>}
      {!loading && items.length === 0 && (
        <p className="text-sm text-inkMuted">Пока нет сохранённых генераций.</p>
      )}
      <ul className="flex max-h-64 flex-col gap-3 overflow-y-auto">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-xl border border-border bg-surface px-3 py-2 text-xs text-inkMuted"
          >
            <span className="text-ink">
              {new Date(item.createdAt).toLocaleString("ru-RU")}
            </span>
            {" · "}
            {item.tone}
            {item.description ? ` · ${item.description.slice(0, 60)}` : ""}
            {item.variants[0] && (
              <p className="mt-1 line-clamp-2 text-ink">{item.variants[0]}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
