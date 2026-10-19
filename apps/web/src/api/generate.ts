import type { FormState, GenerateResponse } from "../types";

export async function requestCaptions(
  form: FormState
): Promise<GenerateResponse> {
  const body = new FormData();
  body.append("description", form.description);
  body.append("tone", form.tone);
  body.append("length", form.length);
  body.append("addEmoji", String(form.addEmoji));
  body.append("addHashtags", String(form.addHashtags));
  body.append("addCta", String(form.addCta));
  if (form.image) {
    body.append("image", form.image);
  }

  const res = await fetch("/api/generate", {
    method: "POST",
    body,
  });

  const data = (await res.json()) as GenerateResponse & { error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? "Не удалось сгенерировать подписи");
  }
  return data;
}
