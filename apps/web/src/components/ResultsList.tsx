import { useState } from "react";

type Props = {
  variants: string[];
  loading: boolean;
  error: string | null;
  hasGenerated: boolean;
  onRegenerate: () => void;
};

export function ResultsList({
  variants,
  loading,
  error,
  hasGenerated,
  onRegenerate,
}: Props) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      setCopiedIndex(null);
    }
  };

  return (
    <section
      className="flex flex-col gap-4 rounded-2xl border border-border bg-surfaceAlt p-6 shadow-sm"
      aria-live="polite"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Варианты подписи
        </h2>
        {hasGenerated && (
          <button
            type="button"
            onClick={onRegenerate}
            disabled={loading}
            className="rounded-xl border border-border px-4 py-2 text-sm text-ink transition hover:border-accent disabled:opacity-50"
          >
            Перегенерировать
          </button>
        )}
      </div>

      {error && (
        <div
          className="rounded-xl border border-red-300/50 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {error}
        </div>
      )}

      {loading && variants.length === 0 && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl bg-surface"
            />
          ))}
        </div>
      )}

      {!loading && variants.length === 0 && !error && (
        <p className="text-sm text-inkMuted">
          Заполните параметры и нажмите «Сгенерировать» — здесь появятся 4
          варианта подписи.
        </p>
      )}

      <ul className="flex flex-col gap-4">
        {variants.map((text, index) => (
          <li
            key={`${index}-${text.slice(0, 24)}`}
            className="rounded-xl border border-border bg-surface p-4"
          >
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">
              {text}
            </p>
            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="text-xs text-inkMuted">
                {text.length} знаков
              </span>
              <button
                type="button"
                onClick={() => copy(text, index)}
                className="rounded-lg bg-accent/15 px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-accent/25"
              >
                {copiedIndex === index ? "Скопировано" : "Скопировать"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
