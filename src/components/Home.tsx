import { CURRICULUM } from "@/lib/curriculum";
import { haptics } from "@/lib/haptics";
import { loadQuizProgress } from "@/lib/quizStorage";
import { scoreCardBg } from "@/lib/scoreColors";
import type { Lesson } from "@/lib/types";
import { useApp } from "@/store/useApp";
import { useEffect, useState } from "react";

type QuizSummary = {
  score: number;
  total: number;
  finished: boolean;
  answered: number;
};

export function Home() {
  const setView = useApp((s) => s.setView);
  const setActiveLesson = useApp((s) => s.setActiveLesson);
  const completed = useApp((s) => s.completed);
  const theme = useApp((s) => s.theme);

  const [quizSummaries, setQuizSummaries] = useState<Map<number, QuizSummary>>(new Map());

  useEffect(() => {
    void (async () => {
      const entries = await Promise.all(
        CURRICULUM.map(async (lesson) => {
          const saved = await loadQuizProgress(lesson.id);
          if (!saved || saved.questions.length === 0) return null;
          return [
            lesson.id,
            {
              score: saved.score,
              total: saved.questions.length,
              finished: saved.idx >= saved.questions.length,
              answered: saved.answers.length,
            },
          ] as const;
        }),
      );
      setQuizSummaries(new Map(entries.filter((e): e is NonNullable<typeof e> => e !== null)));
    })();
  }, []);

  const openLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setView("lesson");
    haptics.tap();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-10">
        <div className="flex items-baseline justify-between mb-5 border-b-2 bd-default pb-2">
          <h2 className="font-serif text-2xl font-bold tx-text">Lessons</h2>
          <div className="text-xs font-mono tx-muted">
            {completed.size} / {CURRICULUM.length} done
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {CURRICULUM.map((lesson) => {
            const summary = quizSummaries.get(lesson.id);
            return (
              <button
                type="button"
                key={lesson.id}
                onClick={() => openLesson(lesson)}
                className="text-left p-5 border-2 bd-default transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
                style={
                  summary?.finished
                    ? {
                        backgroundColor: scoreCardBg(
                          Math.round((summary.score / summary.total) * 100),
                          theme === "dark",
                        ),
                      }
                    : { backgroundColor: "var(--surface)" }
                }
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="text-xs font-mono uppercase tracking-wider tx-muted">
                    {lesson.unit} · Lesson {lesson.id}
                  </div>
                  {summary?.finished ? (
                    <div className="font-mono font-bold text-sm tx-accent">
                      {summary.score}/{summary.total}
                    </div>
                  ) : summary ? (
                    <div className="font-mono text-xs tx-muted">
                      {summary.answered}/{summary.total} →
                    </div>
                  ) : null}
                </div>
                <div className="font-serif text-xl font-bold tx-text mb-1">{lesson.title}</div>
                <div className="tx-muted text-sm">{lesson.titleDe}</div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs font-mono tx-muted">
                    {lesson.vocab.length} vocab words
                  </div>
                  {summary?.finished && (
                    <div className="text-xs font-mono tx-muted">
                      {Math.round((summary.score / summary.total) * 100)}%
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-2 bd-accent bg-accent-bg p-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] tx-accent mb-2">
          Bonus Modul
        </div>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="font-serif text-2xl font-bold tx-text mb-1">Tirolerisch Dictionary</div>
            <div className="tx-body text-sm">The words your textbook won't teach you.</div>
          </div>
          <button
            type="button"
            onClick={() => {
              setView("dialect");
              haptics.tap();
            }}
            className="bg-btn tx-btn px-5 py-2 font-bold border-2 bd-btn hover:opacity-80 transition-opacity"
          >
            Open →
          </button>
        </div>
      </div>
    </div>
  );
}
