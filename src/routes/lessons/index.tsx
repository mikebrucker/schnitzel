import { Header } from "@/components/Header";
import { HeroCard } from "@/components/card/HeroCard";
import { SummaryCard } from "@/components/card/SummaryCard";
import quizzes from "@/data/quizzes.json";
import { CURRICULUM, lessonToPath } from "@/lib/curriculum";
import { haptics } from "@/lib/haptics";
import { loadQuizProgress } from "@/lib/quizStorage";
import { scoreCardBg } from "@/lib/scoreColors";
import type { LanguageProficiencyLevel } from "@/lib/types";
import { useApp } from "@/store/useApp";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const LEVEL_DESC: Partial<Record<LanguageProficiencyLevel, string>> = {
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
          <HeroCard
            eyebrow={nextLesson.level}
            breadcrumb={`Unit ${nextLesson.unit} · Lesson ${nextLesson.lessonNum}`}
            title={nextLesson.title}
            subtitle={nextLesson.titleDe}
            onClick={() => {
              haptics.tap();
              navigate({
                to: "/lessons/$level/$unit/$lessonNum",
                params: lessonToPath(nextLesson),
              });
            }}
            progressPill={(() => {
              const score = nextSummary?.score ?? 0;
              const total =
                nextSummary?.total ??
                (quizzes as Record<string, Array<unknown>>)[String(nextLesson.id)]?.length ??
                0;
              const pct = total > 0 ? Math.round((score / total) * 100) : 0;
              return {
                label: `${score}/${total} · ${pct}%`,
                fillColor: scoreCardBg(pct, theme === "dark"),
                value: score,
                max: total,
                length: "100%",
                bubbles: Math.round(pct * 0.5),
              };
            })()}
          />
        </div>

        <div className="text-xs font-mono uppercase tracking-[0.3em] tx-muted mb-3">Levels</div>
        <div className="grid gap-4 md:grid-cols-2">
          {levels.map((level) => {
            const lessons = CURRICULUM.filter((l) => l.level === level);
            const units = [...new Set(lessons.map((l) => l.unit))];
            const doneCount = lessons.filter((l) => completed.has(l.id)).length;
            const allLevelDone = doneCount === lessons.length;
            return (
              <SummaryCard
                key={level}
                title={level}
                description={LEVEL_DESC[level] ?? ""}
                badge={`${doneCount}/${lessons.length}`}
                badgeAccent={allLevelDone}
                meta={`${units.length} ${units.length === 1 ? "unit" : "units"} · ${lessons.length} ${lessons.length === 1 ? "lesson" : "lessons"}`}
                progress={{ value: doneCount, max: lessons.length }}
                onClick={() => {
                  haptics.tap();
                  navigate({ to: "/lessons/$level", params: { level: level.toLowerCase() } });
                }}
              />
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
