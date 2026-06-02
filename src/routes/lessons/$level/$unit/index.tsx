import { Header } from "@/components/Header";
import { Card } from "@/components/card";
import { HeroCard } from "@/components/card/HeroCard";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
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
          icon: ChevronLeftIcon,
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
            <HeroCard
              size="md"
              breadcrumb={`Lesson ${nextLesson.lessonNum}`}
              title={nextLesson.title}
              subtitle={nextLesson.titleDe}
              onClick={() => openLesson(nextLesson)}
            />
          </div>
        ) : (
          <Card padding="sm" className="mb-8 text-center font-mono tx-muted text-sm">
            Alles fertig! 🏔️
          </Card>
        )}

        <div className="text-xs font-mono uppercase tracking-[0.3em] tx-muted mb-3">Lektionen</div>
        <div className="grid gap-4 md:grid-cols-2">
          {lessons.map((lesson) => {
            const summary = quizSummaries.get(lesson.id);
            const pct = summary ? Math.round((summary.score / summary.total) * 100) : 0;
            return (
              <Card
                key={lesson.id}
                onClick={() => openLesson(lesson)}
                style={
                  summary?.finished
                    ? { backgroundColor: scoreCardBg(pct, theme === "dark") }
                    : { backgroundColor: "var(--surface)" }
                }
              >
                <Card.Row className="mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider tx-muted">
                    Lesson {lesson.lessonNum}
                  </span>
                  {summary?.finished ? (
                    <Card.Badge accent>
                      {summary.score}/{summary.total}
                    </Card.Badge>
                  ) : summary ? (
                    <Card.Caption>
                      {summary.answered}/{summary.total}{" "}
                      <ChevronRightIcon className="inline-block" />
                    </Card.Caption>
                  ) : null}
                </Card.Row>
                <Card.Title size="sm">{lesson.title}</Card.Title>
                <Card.Subtitle>{lesson.titleDe}</Card.Subtitle>
                <Card.Row align="center" className="mt-3">
                  <Card.Caption>{lesson.vocab.length} vocab words</Card.Caption>
                  {summary?.finished ? <Card.Caption>{pct}%</Card.Caption> : null}
                </Card.Row>
              </Card>
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
