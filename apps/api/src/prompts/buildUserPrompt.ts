import type { GenerateFields } from "../middleware/validateGenerate.js";

const TONE_LABELS: Record<GenerateFields["tone"], string> = {
  atmospheric: "Атмосферный / расслабляющий — образы и ощущения, без давления",
  selling:
    "Продающий — мягкий premium-upsell, изящное приглашение, без крикливых формулировок",
  expert:
    "Экспертный — знание процедур и ухода, без медицинских диагнозов и обещаний лечения",
  short_aesthetic:
    "Короткий / эстетичный — лаконично, визуально, в духе эстетичного Instagram",
};

const LENGTH_LIMITS: Record<GenerateFields["length"], number> = {
  short: 150,
  medium: 500,
  long: 1500,
};

export function buildUserPrompt(
  fields: GenerateFields,
  hasImage: boolean
): string {
  const maxChars = LENGTH_LIMITS[fields.length];
  const lines: string[] = [
    "Сгенерируй 4 варианта подписи к публикации SPA-салона.",
    `Тональность: ${TONE_LABELS[fields.tone]}.`,
    `Максимальная длина каждого варианта: ${maxChars} знаков (считай пробелы и эмодзи).`,
  ];

  if (hasImage) {
    lines.push(
      "На изображении проанализируй сцену и отрази её в подписи."
    );
  }

  if (fields.description?.trim()) {
    lines.push(
      `Ключевые слова / описание от пользователя: ${fields.description.trim()}`
    );
  }

  if (fields.addEmoji) {
    lines.push("Добавь уместные эмодзи (не перегружай).");
  } else {
    lines.push("Без эмодзи.");
  }

  if (fields.addHashtags) {
    lines.push(
      "В конце каждого варианта добавь 3–5 релевантных хэштегов на русском или латинице."
    );
  } else {
    lines.push("Без хэштегов.");
  }

  if (fields.addCta) {
    lines.push(
      "Включи мягкий призыв к действию (запись, подарить себе ритуал, узнать подробности) — без агрессии."
    );
  } else {
    lines.push("Без явного призыва к действию.");
  }

  lines.push(
    "Варианты должны отличаться по формулировке и акцентам, но оставаться в одной тональности."
  );

  return lines.join("\n");
}
