import { Header } from "@/components/Header";
import { CURRICULUM, lessonToPath } from "@/lib/curriculum";
import { haptics } from "@/lib/haptics";
import { loadQuizProgress } from "@/lib/quizStorage";
import { scoreCardBg } from "@/lib/scoreColors";
import { useApp } from "@/store/useApp";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const LEVEL_DESC: Record<string, string> = {
  A1: "Beginner",
  A2: "Elementary",
  B1: "Intermediate",
  B2: "Upper Intermediate",
};

type QuizSummary = { score: number; total: number; finished: boolean };

function LessonsIndexRoute() {
  const navigate = useNavigate();
  const completed = useApp((s) => s.completed);
  const theme = useApp((s) => s.theme);

  const levels = [...new Set(CURRICULUM.map((l) => l.level))];
  const nextLesson =
    CURRICULUM.find((l) => !completed.has(l.id)) ?? CURRICULUM[CURRICULUM.length - 1];

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
            },
          ] as const;
        }),
      );
      setQuizSummaries(new Map(entries.filter((e): e is NonNullable<typeof e> => e !== null)));
    })();
  }, []);

  const allDone = CURRICULUM.every((l) => completed.has(l.id));
  const nextSummary = quizSummaries.get(nextLesson.id);

  return (
    <>
      <Header title="Lektionen" subtitle="Tirol-Edition" />
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="mb-10">
          <div className="text-xs font-mono uppercase tracking-[0.3em] tx-muted mb-2">
            {allDone ? "Alles fertig" : "Weiter"}
          </div>
          <button
            type="button"
            onClick={() => {
              haptics.tap();
              navigate({
                to: "/lessons/$level/$unit/$lessonNum",
                params: lessonToPath(nextLesson),
              });
            }}
            className="w-full text-left p-6 border-2 bd-accent bg-accent-bg transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
          >
            <div>
              <div className="font-serif text-3xl font-black tx-text">{nextLesson.level}</div>
              <div className="text-sm font-mono tracking-wider tx-muted mb-3 mt-0.5">
                Unit {nextLesson.unit} · Lesson {nextLesson.lessonNum}
              </div>
            </div>
            <div className="font-serif text-3xl font-black tx-text mb-1">{nextLesson.title}</div>
            <div className="tx-muted mb-4">{nextLesson.titleDe}</div>
            {nextSummary?.finished && (
              <div
                className="inline-block font-mono text-sm px-2 py-0.5"
                style={{
                  backgroundColor: scoreCardBg(
                    Math.round((nextSummary.score / nextSummary.total) * 100),
                    theme === "dark",
                  ),
                }}
              >
                {nextSummary.score}/{nextSummary.total} ·{" "}
                {Math.round((nextSummary.score / nextSummary.total) * 100)}%
              </div>
            )}
          </button>
        </div>

        <div className="text-xs font-mono uppercase tracking-[0.3em] tx-muted mb-3">Levels</div>
        <div className="grid gap-4 md:grid-cols-2">
          {levels.map((level) => {
            const lessons = CURRICULUM.filter((l) => l.level === level);
            const units = [...new Set(lessons.map((l) => l.unit))];
            const doneCount = lessons.filter((l) => completed.has(l.id)).length;
            const allLevelDone = doneCount === lessons.length;
            return (
              <button
                type="button"
                key={level}
                onClick={() => {
                  haptics.tap();
                  navigate({ to: "/lessons/$level", params: { level: level.toLowerCase() } });
                }}
                className="text-left p-5 border-2 bd-default bg-surface transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-serif text-3xl font-black tx-text">{level}</div>
                    <div className="text-xs font-mono tx-muted mt-0.5">
                      {LEVEL_DESC[level] ?? ""}
                    </div>
                  </div>
                  <div
                    className={`font-mono text-sm font-bold ${allLevelDone ? "tx-accent" : "tx-muted"}`}
                  >
                    {doneCount}/{lessons.length}
                  </div>
                </div>
                <div className="text-xs font-mono tx-muted">
                  {units.length} {units.length === 1 ? "unit" : "units"} · {lessons.length}{" "}
                  {lessons.length === 1 ? "lesson" : "lessons"}
                </div>
                <div className="mt-3 w-full h-1 bg-surface-solid">
                  <div
                    className="h-full"
                    style={{
                      width: `${Math.round((doneCount / lessons.length) * 100)}%`,
                      backgroundColor: "var(--accent-border)",
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

export const Route = createFileRoute("/lessons/")({
  component: LessonsIndexRoute,
});
