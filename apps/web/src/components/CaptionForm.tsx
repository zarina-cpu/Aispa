import { useCallback, useEffect, useState } from "react";
import type { FormState } from "../types";
import type { LengthOption, Tone } from "../types";

type Props = {
  form: FormState;
  loading: boolean;
  canSubmit: boolean;
  onChange: (patch: Partial<FormState>) => void;
  onSubmit: () => void;
};

const TONE_OPTIONS: { value: Tone; label: string }[] = [
  { value: "atmospheric", label: "Атмосферный / расслабляющий" },
  { value: "selling", label: "Продающий" },
  { value: "expert", label: "Экспертный" },
  { value: "short_aesthetic", label: "Короткий / эстетичный" },
];

const LENGTH_OPTIONS: { value: LengthOption; label: string }[] = [
  { value: "short", label: "Короткий (до 150 знаков)" },
  { value: "medium", label: "Средний (до 500 знаков)" },
  { value: "long", label: "Длинный / пост (до 1500 знаков)" },
];

export function CaptionForm({
  form,
  loading,
  canSubmit,
  onChange,
  onSubmit,
}: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!form.image) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(form.image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [form.image]);

  const onFile = useCallback(
    (file: File | null) => {
      if (!file) {
        onChange({ image: null });
        return;
      }
      const allowed = ["image/jpeg", "image/png", "image/webp"];
      if (!allowed.includes(file.type)) return;
      onChange({ image: file });
    },
    [onChange]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  return (
    <form
      className="flex flex-col gap-5 rounded-2xl border border-border bg-surfaceAlt p-6 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div>
        <label className="mb-2 block text-sm font-medium text-ink">
          Фото для анализа
        </label>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative flex min-h-[140px] flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 transition ${
            dragOver ? "border-accent bg-accent/10" : "border-border"
          }`}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Превью"
              className="max-h-32 rounded-lg object-cover"
            />
          ) : (
            <p className="text-center text-sm text-inkMuted">
              Перетащите изображение или выберите файл
            </p>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
        </div>
        {form.image && (
          <button
            type="button"
            className="mt-2 text-sm text-inkMuted underline hover:text-ink"
            onClick={() => onFile(null)}
          >
            Удалить фото
          </button>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-ink"
        >
          Описание / ключевые слова
        </label>
        <textarea
          id="description"
          rows={4}
          value={form.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Например: массаж горячими камнями, вечерний ритуал, лавандовый аромат..."
          className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-inkMuted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        <p className="mt-1 text-xs text-inkMuted">
          Нужно фото или текст — хотя бы одно из двух
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="tone"
            className="mb-2 block text-sm font-medium text-ink"
          >
            Тональность
          </label>
          <select
            id="tone"
            value={form.tone}
            onChange={(e) => onChange({ tone: e.target.value as Tone })}
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            {TONE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="length"
            className="mb-2 block text-sm font-medium text-ink"
          >
            Длина текста
          </label>
          <select
            id="length"
            value={form.length}
            onChange={(e) =>
              onChange({ length: e.target.value as LengthOption })
            }
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            {LENGTH_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-medium text-ink">Настройки</legend>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.addEmoji}
            onChange={(e) => onChange({ addEmoji: e.target.checked })}
            className="rounded border-border text-accent focus:ring-accent"
          />
          Добавить эмодзи
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.addHashtags}
            onChange={(e) => onChange({ addHashtags: e.target.checked })}
            className="rounded border-border text-accent focus:ring-accent"
          />
          Добавить хэштеги
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.addCta}
            onChange={(e) => onChange({ addCta: e.target.checked })}
            className="rounded border-border text-accent focus:ring-accent"
          />
          Включить призыв к действию (CTA)
        </label>
      </fieldset>

      <button
        type="submit"
        disabled={!canSubmit || loading}
        className="rounded-xl bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-accentHover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Генерация…" : "Сгенерировать"}
      </button>
    </form>
  );
}
