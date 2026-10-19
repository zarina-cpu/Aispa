export type Tone =
  | "atmospheric"
  | "selling"
  | "expert"
  | "short_aesthetic";

export type LengthOption = "short" | "medium" | "long";

export type FormState = {
  description: string;
  tone: Tone;
  length: LengthOption;
  addEmoji: boolean;
  addHashtags: boolean;
  addCta: boolean;
  image: File | null;
};

export type GenerateResponse = {
  variants: string[];
};
