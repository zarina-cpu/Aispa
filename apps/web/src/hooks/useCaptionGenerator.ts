import { useCallback, useRef, useState } from "react";
import { requestCaptions } from "../api/generate";
import type { FormState } from "../types";

const defaultForm: FormState = {
  description: "",
  tone: "atmospheric",
  length: "medium",
  addEmoji: true,
  addHashtags: true,
  addCta: false,
  image: null,
};

export function useCaptionGenerator() {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [variants, setVariants] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFormRef = useRef<FormState | null>(null);

  const canSubmit =
    Boolean(form.image) || form.description.trim().length > 0;

  const runGenerate = useCallback(async (payload: FormState) => {
    setLoading(true);
    setError(null);
    try {
      const { variants: next } = await requestCaptions(payload);
      setVariants(next);
      lastFormRef.current = payload;
      window.dispatchEvent(new CustomEvent("spa-caption-generated"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  }, []);

  const generate = useCallback(() => {
    if (!canSubmit || loading) return;
    void runGenerate(form);
  }, [canSubmit, form, loading, runGenerate]);

  const regenerate = useCallback(() => {
    const payload = lastFormRef.current ?? form;
    if (!payload.image && !payload.description.trim()) return;
    void runGenerate(payload);
  }, [form, runGenerate]);

  const updateForm = useCallback((patch: Partial<FormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  }, []);

  return {
    form,
    updateForm,
    variants,
    loading,
    error,
    canSubmit,
    generate,
    regenerate,
  };
}
