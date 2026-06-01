import { CURRICULUM, lessonToPath } from "@/lib/curriculum";
import { haptics } from "@/lib/haptics";
import { loadQuizProgress } from "@/lib/quizStorage";
import { useApp } from "@/store/useApp";
import { createFileRoute, useLoaderData, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const LEVEL_DESC: Record<string, string> = {
  A1: "Beginner",
  A2: "Elementary",
  B1: "Intermediate",
  B2: "Upper Intermediate",
};

type QuizSummary = { score: number; total: number; finished: boolean };

function LevelIndexRoute() {
  const { level } = useLoaderData({ from: "/lessons/$level" });
  const navigate = useNavigate();
  const completed = useApp((s) => s.completed);

  const lessons = CURRICULUM.filter((l) => l.level === level);
  const units = [...new Set(lessons.map((l) => l.unit))];
  const doneCount = lessons.filter((l) => completed.has(l.id)).length;
  const nextLesson = lessons.find((l) => !completed.has(l.id));

  const [quizSummaries, setQuizSummaries] = useState<Map<number, QuizSummary>>(new Map());

  useEffect(() => {
    const levelLessons = CURRICULUM.filter((l) => l.level === level);
    void (async () => {
      const entries = await Promise.all(
        levelLessons.map(async (lesson) => {
          const saved = await loadQuizProgress(lesson.id);
          if (!saved || saved.questions.length === 0) return null;
          return [
            lesson.id,
            {
              score: saved.score,
              total: saved.questions.length,
              finished: saved.idx >= saved.questions.length,
            },
          ] as const;
        }),
      );
      setQuizSummaries(new Map(entries.filter((e): e is NonNullable<typeof e> => e !== null)));
    })();
  }, [level]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <button
        type="button"
        onClick={() => {
          haptics.tap();
          navigate({ to: "/lessons" });
        }}
        className="text-sm font-mono tx-muted mb-6"
      >
        ← Lessons
      </button>

      <div className="text-xs font-mono uppercase tracking-[0.3em] tx-muted mb-1">
        {LEVEL_DESC[level] ?? level}
      </div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-4xl font-black tx-text">{level}</h1>
        <span className="text-xs font-mono tx-muted">
          {doneCount} / {lessons.length} done
        </span>
      </div>

      {nextLesson ? (
        <div className="mb-8">
          <div className="text-xs font-mono uppercase tracking-[0.3em] tx-muted mb-2">Weiter</div>
          <button
            type="button"
            onClick={() => {
              haptics.tap();
              navigate({
                to: "/lessons/$level/$unit/$lessonNum",
                params: lessonToPath(nextLesson),
              });
            }}
            className="w-full text-left p-5 border-2 bd-accent bg-accent-bg transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
          >
            <div className="text-xs font-mono uppercase tracking-wider tx-muted mb-2">
              Unit {nextLesson.unit} · Lesson {nextLesson.lessonNum}
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

      <div className="text-xs font-mono uppercase tracking-[0.3em] tx-muted mb-3">Units</div>
      <div className="space-y-3">
        {units.map((unit) => {
          const unitLessons = lessons.filter((l) => l.unit === unit);
          const unitDone = unitLessons.filter((l) => completed.has(l.id)).length;
          const unitSummaries = unitLessons.map((l) => quizSummaries.get(l.id)).filter(Boolean);
          const allFinished =
            unitSummaries.length === unitLessons.length && unitSummaries.every((s) => s?.finished);
          return (
            <button
              type="button"
              key={unit}
              onClick={() => {
                haptics.tap();
                navigate({
                  to: "/lessons/$level/$unit",
                  params: { level: level.toLowerCase(), unit: String(unit) },
                });
              }}
              className="w-full text-left p-5 border-2 bd-default bg-surface transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif text-xl font-bold tx-text">Unit {unit}</span>
                <span className={`text-xs font-mono ${allFinished ? "tx-accent" : "tx-muted"}`}>
                  {unitDone} / {unitLessons.length} done
                </span>
              </div>
              <div className="text-sm tx-muted">{unitLessons.map((l) => l.title).join(" · ")}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/lessons/$level/")({
  component: LevelIndexRoute,
});
