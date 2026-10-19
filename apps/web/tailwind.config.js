/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: "var(--color-surface)",
        surfaceAlt: "var(--color-surface-alt)",
        ink: "var(--color-ink)",
        inkMuted: "var(--color-ink-muted)",
        accent: "var(--color-accent)",
        accentHover: "var(--color-accent-hover)",
        border: "var(--color-border)",
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Cormorant Garamond", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
