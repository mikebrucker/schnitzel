import { Header } from "@/components/Header";
import { ChevronLeftIcon } from "@/components/icons";
import { CURRICULUM, lessonToPath } from "@/lib/curriculum";
import { haptics } from "@/lib/haptics";
import { loadQuizProgress } from "@/lib/quizStorage";
import { scoreCardBg } from "@/lib/scoreColors";
import type { Lesson } from "@/lib/types";
import { useApp } from "@/store/useApp";
import { createFileRoute, useLoaderData, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type QuizSummary = { score: number; total: number; finished: boolean; answered: number };

function UnitIndexRoute() {
  const { level, unit } = useLoaderData({ from: "/lessons/$level/$unit" });
  const navigate = useNavigate();
  const completed = useApp((s) => s.completed);
  const theme = useApp((s) => s.theme);

  const lessons = CURRICULUM.filter((l) => l.level === level && l.unit === unit);
  const doneCount = lessons.filter((l) => completed.has(l.id)).length;
  const nextLesson = lessons.find((l) => !completed.has(l.id));

  const [quizSummaries, setQuizSummaries] = useState<Map<number, QuizSummary>>(new Map());

  useEffect(() => {
    const unitLessons = CURRICULUM.filter((l) => l.level === level && l.unit === unit);
    void (async () => {
      const entries = await Promise.all(
        unitLessons.map(async (lesson) => {
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
  }, [level, unit]);

  const openLesson = (lesson: Lesson) => {
    haptics.tap();
    navigate({ to: "/lessons/$level/$unit/$lessonNum", params: lessonToPath(lesson) });
  };

  return (
    <>
      <Header
        title={`Unit ${unit}`}
        subtitle={`${level} · ${doneCount}/${lessons.length}`}
        secondaryAction={{
          label: level,
          icon: <ChevronLeftIcon size={16} />,
          onClick: () => {
            haptics.tap();
            navigate({ to: "/lessons/$level", params: { level: level.toLowerCase() } });
          },
        }}
      />
      <div className="max-w-4xl mx-auto px-4 py-4">
        {nextLesson ? (
          <div className="mb-8">
            <div className="text-xs font-mono uppercase tracking-[0.3em] tx-muted mb-2">Weiter</div>
            <button
              type="button"
              onClick={() => openLesson(nextLesson)}
              className="w-full text-left p-5 border-2 bd-accent bg-accent-bg transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
            >
              <div className="text-xs font-mono uppercase tracking-wider tx-muted mb-2">
                Lesson {nextLesson.lessonNum}
              </div>
              <div className="font-serif text-2xl font-black tx-text mb-1">{nextLesson.title}</div>
              <div className="tx-muted text-sm">{nextLesson.titleDe}</div>
            </button>
          </div>
        ) : (
          <div className="mb-8 p-4 border-2 bd-default bg-surface text-center font-mono tx-muted text-sm">
            Alles fertig! 🏔️
          </div>
        )}

        <div className="text-xs font-mono uppercase tracking-[0.3em] tx-muted mb-3">Lektionen</div>
        <div className="grid gap-4 md:grid-cols-2">
          {lessons.map((lesson) => {
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
                    Lesson {lesson.lessonNum}
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
    </>
  );
}

export const Route = createFileRoute("/lessons/$level/$unit/")({
  component: UnitIndexRoute,
});
