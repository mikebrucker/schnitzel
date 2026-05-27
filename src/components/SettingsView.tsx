import { CURRICULUM } from "@/lib/curriculum";
import { haptics } from "@/lib/haptics";
import { clearQuizProgress, loadQuizProgress } from "@/lib/quizStorage";
import { scoreCardBg, scoreTextClass } from "@/lib/scoreColors";
import type { LessonStat, Theme } from "@/lib/types";
import { useApp } from "@/store/useApp";
import { useEffect, useState } from "react";

export function SettingsView() {
  const setView = useApp((s) => s.setView);
  const theme = useApp((s) => s.theme);
  const setTheme = useApp((s) => s.setTheme);
  const completed = useApp((s) => s.completed);
  const unmark = useApp((s) => s.unmarkLessonComplete);
  const resetAll = useApp((s) => s.resetAllProgress);

  const [confirming, setConfirming] = useState(false);
  const [progress, setProgress] = useState<Record<number, LessonStat>>({});
  const [reloadKey, setReloadKey] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reloadKey & completed trigger re-runs intentionally
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const next: Record<number, LessonStat> = {};
      for (const lesson of CURRICULUM) {
        const saved = await loadQuizProgress(lesson.id);
        if (saved) {
          const total = saved.questions?.length ?? 0;
          next[lesson.id] = {
            answered: saved.answers?.length ?? 0,
            score: saved.score ?? 0,
            total,
            finished: saved.idx >= total,
          };
        }
      }
      if (!cancelled) setProgress(next);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [reloadKey, completed]);

  const resetLesson = async (id: number) => {
    unmark(id);
    await clearQuizProgress(id);
    setReloadKey((k) => k + 1);
    haptics.tap();
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <button
        type="button"
        onClick={() => {
          setView("home");
          haptics.tap();
        }}
        className="text-sm font-mono mb-6 tx-muted"
      >
        ← Back
      </button>

      <div className="text-xs font-mono uppercase tracking-[0.3em] tx-muted mb-2">
        Einstellungen
      </div>
      <h1 className="font-serif text-4xl font-black tx-text mb-8">Settings</h1>

      <section className="mb-10">
        <h2 className="font-serif text-xl font-bold tx-text mb-4 pb-1 border-b-2 bd-default">
          Theme
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {(["light", "dark"] as Array<Theme>).map((t) => {
            const active = theme === t;
            return (
              <button
                type="button"
                key={t}
                onClick={() => {
                  setTheme(t);
                  haptics.tap();
                }}
                className={`p-5 border-2 text-left transition-all ${
                  active ? "bd-accent bg-accent-bg" : "bd-default bg-surface"
                }`}
              >
                <div className="font-serif text-lg font-bold capitalize mb-1 tx-text">{t}</div>
                <div className="text-xs font-mono tx-muted">
                  {t === "dark" ? "Chalkboard mode" : "Paper mode"}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-serif text-xl font-bold tx-text mb-4 pb-1 border-b-2 bd-default">
          Per-Lesson Progress
        </h2>
        <div className="space-y-2">
          {CURRICULUM.map((lesson) => {
            const p = progress[lesson.id];
            const pct = p?.finished ? Math.round((p.score / p.total) * 100) : null;
            const showReset = p && p.answered > 0;

            return (
              <div
                key={lesson.id}
                className="border-2 bd-default px-4 py-3"
                style={
                  p?.finished && pct !== null
                    ? { backgroundColor: scoreCardBg(pct, theme === "dark") }
                    : { backgroundColor: "var(--surface)" }
                }
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex-1 min-w-0">
                    <span className="font-mono font-bold tx-text text-sm uppercase tracking-wider">
                      {lesson.level} · U{lesson.unit} · L{lesson.lessonNum}
                    </span>
                    <span className="font-serif text-xs tx-muted ml-2">{lesson.title}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {p?.finished && pct !== null ? (
                      <span className={`font-mono font-bold text-sm ${scoreTextClass(pct)}`}>
                        {p.score}/{p.total} · {pct}%
                      </span>
                    ) : p ? (
                      <span className="font-mono text-xs tx-muted">
                        {p.answered}/{p.total} →
                      </span>
                    ) : (
                      <span className="font-mono text-xs tx-muted">not started</span>
                    )}
                    {showReset && (
                      <button
                        type="button"
                        onClick={() => resetLesson(lesson.id)}
                        className="px-2 py-1 text-xs font-mono font-bold border-2 bd-default tx-text hover:opacity-70 transition-opacity"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
                <div className="w-full h-1 bg-surface-solid mt-2">
                  {p?.finished && pct !== null && (
                    <div
                      className="h-full"
                      style={{ width: `${pct}%`, backgroundColor: "var(--accent-border)" }}
                    />
                  )}
                  {p && !p.finished && (
                    <div
                      className="h-full opacity-40"
                      style={{
                        width: `${Math.round((p.answered / p.total) * 100)}%`,
                        backgroundColor: "var(--accent-border)",
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-xl font-bold tx-text mb-4 pb-1 border-b-2 bd-default">
          Danger Zone
        </h2>
        {!confirming ? (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="px-5 py-3 border-2 bd-default tx-text font-bold"
          >
            Reset all progress
          </button>
        ) : (
          <div
            className="p-5 border-2"
            style={{ borderColor: "#dc2626", background: "rgba(220,38,38,0.1)" }}
          >
            <div className="mb-3 tx-text">
              Erase all quiz progress and lesson checkmarks. Cannot undo.
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={async () => {
                  await resetAll();
                  setReloadKey((k) => k + 1);
                  setConfirming(false);
                  haptics.wrong();
                }}
                className="px-4 py-2 font-bold bg-red-600 text-white"
              >
                Yes, erase everything
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="px-4 py-2 font-bold border-2 bd-default tx-text"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
