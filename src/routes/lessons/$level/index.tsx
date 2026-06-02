import { Header } from "@/components/Header";
import { Card } from "@/components/card";
import { HeroCard } from "@/components/card/HeroCard";
import { ChevronLeftIcon } from "@/components/icons";
import { CURRICULUM, lessonToPath } from "@/lib/curriculum";
import { haptics } from "@/lib/haptics";
import { loadQuizProgress } from "@/lib/quizStorage";
import type { LanguageProficiencyLevel } from "@/lib/types";
import { useApp } from "@/store/useApp";
import { createFileRoute, useLoaderData, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const LEVEL_DESC: Partial<Record<LanguageProficiencyLevel, string>> = {
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
    <>
      <Header
        title={level}
        subtitle={`${LEVEL_DESC[level] ?? level} · ${doneCount}/${lessons.length}`}
        secondaryAction={{
          label: "Lektionen",
          icon: ChevronLeftIcon,
          onClick: () => {
            haptics.tap();
            navigate({ to: "/lessons" });
          },
        }}
      />
      <div className="max-w-4xl mx-auto px-4 py-4">
        {nextLesson ? (
          <div className="mb-8">
            <div className="text-xs font-mono uppercase tracking-[0.3em] tx-muted mb-2">Weiter</div>
            <HeroCard
              size="md"
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
            />
          </div>
        ) : (
          <Card padding="sm" className="mb-8 text-center font-mono tx-muted text-sm">
            Alles fertig! 🏔️
          </Card>
        )}

        <div className="text-xs font-mono uppercase tracking-[0.3em] tx-muted mb-3">Units</div>
        <div className="space-y-3">
          {units.map((unit) => {
            const unitLessons = lessons.filter((l) => l.unit === unit);
            const unitDone = unitLessons.filter((l) => completed.has(l.id)).length;
            const unitSummaries = unitLessons.map((l) => quizSummaries.get(l.id)).filter(Boolean);
            const allFinished =
              unitSummaries.length === unitLessons.length &&
              unitSummaries.every((s) => s?.finished);
            return (
              <Card
                key={unit}
                className="w-full"
                onClick={() => {
                  haptics.tap();
                  navigate({
                    to: "/lessons/$level/$unit",
                    params: { level: level.toLowerCase(), unit: String(unit) },
                  });
                }}
              >
                <Card.Row align="center" className="mb-2">
                  <Card.Title size="sm">{`Unit ${unit}`}</Card.Title>
                  <Card.Caption className={allFinished ? "tx-accent" : ""}>
                    {unitDone} / {unitLessons.length} done
                  </Card.Caption>
                </Card.Row>
                <Card.Subtitle>{unitLessons.map((l) => l.title).join(" · ")}</Card.Subtitle>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}

export const Route = createFileRoute("/lessons/$level/")({
  component: LevelIndexRoute,
});
