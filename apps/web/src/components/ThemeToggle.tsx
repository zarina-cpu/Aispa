import type { Theme } from "../hooks/useTheme";

type Props = {
  theme: Theme;
  onToggle: () => void;
};

export function ThemeToggle({ theme, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-full border border-border bg-surfaceAlt px-4 py-2 text-sm text-inkMuted transition hover:border-accent hover:text-ink"
      aria-label={
        theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"
      }
    >
      {theme === "dark" ? "Светлая тема" : "Тёмная тема"}
    </button>
  );
}
