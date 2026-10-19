import { CaptionForm } from "./components/CaptionForm";
import { ResultsList } from "./components/ResultsList";
import { HistoryPanel } from "./components/HistoryPanel";
import { ThemeToggle } from "./components/ThemeToggle";
import { useCaptionGenerator } from "./hooks/useCaptionGenerator";
import { useTheme } from "./hooks/useTheme";

function App() {
  const { theme, toggle } = useTheme();
  const {
    form,
    updateForm,
    variants,
    loading,
    error,
    canSubmit,
    generate,
    regenerate,
  } = useCaptionGenerator();

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-widest text-inkMuted">
            Premium SPA
          </p>
          <h1 className="font-display text-4xl font-semibold text-ink sm:text-5xl">
            SPA Caption Studio
          </h1>
          <p className="mt-2 max-w-xl text-sm text-inkMuted">
            AI-генератор подписей к фото: загрузите кадр или опишите ритуал —
            получите несколько готовых текстов в нужной тональности.
          </p>
        </div>
        <ThemeToggle theme={theme} onToggle={toggle} />
      </header>

      <main className="grid gap-8 lg:grid-cols-2 lg:items-start xl:grid-cols-[1fr_1fr]">
        <CaptionForm
          form={form}
          loading={loading}
          canSubmit={canSubmit}
          onChange={updateForm}
          onSubmit={generate}
        />
        <ResultsList
          variants={variants}
          loading={loading}
          error={error}
          hasGenerated={variants.length > 0}
          onRegenerate={regenerate}
        />
      </main>

      <div className="mt-8">
        <HistoryPanel />
      </div>
    </div>
  );
}

export default App;
