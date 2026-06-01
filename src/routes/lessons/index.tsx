import { Accordion } from "@/components/Accordion";
import { CURRICULUM } from "@/lib/curriculum";
import { haptics } from "@/lib/haptics";
import { loadQuizProgress } from "@/lib/quizStorage";
import { scoreCardBg } from "@/lib/scoreColors";
import { storage } from "@/lib/storage";
import type { Lesson } from "@/lib/types";
import { useApp } from "@/store/useApp";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type QuizSummary = {
  score: number;
  total: number;
  finished: boolean;
  answered: number;
};

function LessonsIndexRoute() {
  const navigate = useNavigate();
  const completed = useApp((s) => s.completed);
  const theme = useApp((s) => s.theme);

  const [quizSummaries, setQuizSummaries] = useState<Map<number, QuizSummary>>(new Map());
  const [levelOpen, setLevelOpen] = useState<Record<string, boolean>>({});
  const [unitOpen, setUnitOpen] = useState<Record<string, Array<number>>>({});

  useEffect(() => {
    storage.getJSON<Record<string, boolean>>("home-level-state").then((saved) => {
      if (saved) setLevelOpen(saved);
    });
    storage.getJSON<Record<string, Array<number>>>("home-unit-state-multi").then((saved) => {
      if (saved) setUnitOpen(saved);
    });
  }, []);

  const toggleLevel = (level: string) => {
    const next = { ...levelOpen, [level]: !(levelOpen[level] !== false) };
    setLevelOpen(next);
    void storage.setJSON("home-level-state", next);
  };

  const setUnitOpenFor = (level: string, indices: Array<number>) => {
    const next = { ...unitOpen, [level]: indices };
    setUnitOpen(next);
    void storage.setJSON("home-unit-state-multi", next);
  };

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
    haptics.tap();
    navigate({ to: "/lessons/$id", params: { id: String(lesson.id) } });
  };

  const levels = [...new Set(CURRICULUM.map((l) => l.level))];

  const lessonGrid = (lessons: Array<Lesson>) => (
    <div className="grid gap-4 md:grid-cols-2 pt-4">
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
                Unit {lesson.unit} · Lesson {lesson.lessonNum}
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
              <div className="text-xs font-mono tx-muted">{lesson.vocab.length} vocab words</div>
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
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <div className="mb-10 space-y-12">
        {levels.map((level) => {
          const lessons = CURRICULUM.filter((l) => l.level === level);
          const doneCount = lessons.filter((l) => completed.has(l.id)).length;
          return (
            <Accordion
              key={level}
              openIndex={levelOpen[level] !== false ? 0 : null}
              onOpenChange={() => toggleLevel(level)}
              items={[
                {
                  title: level,
                  subtitle: `${doneCount} / ${lessons.length} done`,
                  content: (
                    <Accordion
                      multi
                      compact
                      openIndices={unitOpen[level] ?? [0]}
                      onOpenChange={(indices) => setUnitOpenFor(level, indices)}
                      items={[...new Set(lessons.map((l) => l.unit))].map((unit) => {
                        const unitLessons = lessons.filter((l) => l.unit === unit);
                        const unitDone = unitLessons.filter((l) => completed.has(l.id)).length;
                        return {
                          title: `Unit ${unit}`,
                          subtitle: `${unitDone} / ${unitLessons.length} done`,
                          content: lessonGrid(unitLessons),
                        };
                      })}
                    />
                  ),
                },
              ]}
            />
          );
        })}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/lessons/")({
  component: LessonsIndexRoute,
});
