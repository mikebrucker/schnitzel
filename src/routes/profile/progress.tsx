import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { ProgressCard } from "@/components/card/ProgressCard";
import { ChevronLeftIcon, RetryIcon, XIcon } from "@/components/icons";
import { CURRICULUM } from "@/lib/curriculum";
import { haptics } from "@/lib/haptics";
import { clearQuizProgress, loadQuizProgress } from "@/lib/quizStorage";
import type { Lesson, LessonStat } from "@/lib/types";
import { useApp } from "@/store/useApp";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type LessonEntry = (LessonStat & { id: number; title: string }) | null;

type LevelGroup = {
  level: string;
  entries: Array<{ lesson: Lesson; idx: number }>;
};

const LEVEL_GROUPS: Array<LevelGroup> = CURRICULUM.reduce<Array<LevelGroup>>((acc, lesson, i) => {
  const last = acc[acc.length - 1];
  if (last && last.level === lesson.level) {
    last.entries.push({ lesson, idx: i });
  } else {
    acc.push({ level: lesson.level, entries: [{ lesson, idx: i }] });
  }
  return acc;
}, []);

function ProgressRoute() {
  const navigate = useNavigate();
  const completed = useApp((s) => s.completed);
  const theme = useApp((s) => s.theme);
  const unmark = useApp((s) => s.unmarkLessonComplete);

  const [lessonStats, setLessonStats] = useState<Array<LessonEntry>>([]);
  const [resetMode, setResetMode] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: completed & reloadKey trigger re-load intentionally
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const perLesson: Array<LessonEntry> = [];
      for (const lesson of CURRICULUM) {
        const saved = await loadQuizProgress(lesson.id);
        if (!saved) {
          perLesson.push(null);
          continue;
        }
        perLesson.push({
          id: lesson.id,
          title: lesson.title,
          score: saved.score,
          total: saved.questions.length,
          finished: saved.idx >= saved.questions.length,
          answered: saved.answers?.length ?? 0,
        });
      }
      if (!cancelled) setLessonStats(perLesson);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [completed, reloadKey]);

  const handleResetLesson = async (id: number) => {
    unmark(id);
    await clearQuizProgress(id);
    setReloadKey((k) => k + 1);
    haptics.tap();
  };

  const handleResetLevel = async (entries: Array<{ lesson: Lesson; idx: number }>) => {
    await Promise.all(entries.map(({ lesson }) => handleResetLesson(lesson.id)));
  };

  return (
    <>
      <Header
        title="Fortschritt"
        subtitle="Per Lesson"
        secondaryAction={{
          label: "Profil",
          icon: ChevronLeftIcon,
          onClick: () => {
            haptics.tap();
            navigate({ to: "/profile" });
          },
        }}
        primaryAction={{
          label: resetMode ? "Done" : "Reset",
          icon: resetMode ? XIcon : RetryIcon,
          variant: resetMode ? "accent" : "danger",
          onClick: () => {
            setResetMode((r) => !r);
            haptics.tap();
          },
        }}
      />
      <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
        {LEVEL_GROUPS.map((group) => (
          <section key={group.level}>
            <div className="flex items-center justify-between mb-4 pb-1 border-b-2 bd-default">
              <h2 className="font-serif text-2xl font-bold tx-text">
                Level {group.level.toLocaleUpperCase()}
              </h2>
              {resetMode ? (
                <Button
                  label="Reset level"
                  variant="danger"
                  fill="outline"
                  size="sm"
                  icon={<RetryIcon />}
                  onClick={() => handleResetLevel(group.entries)}
                />
              ) : null}
            </div>
            <div className="space-y-2">
              {group.entries.map(({ lesson, idx }) => (
                <ProgressCard
                  key={lesson.id}
                  lesson={lesson}
                  stat={lessonStats[idx] ?? null}
                  theme={theme}
                  onReset={
                    resetMode && lessonStats[idx] ? () => handleResetLesson(lesson.id) : undefined
                  }
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

export const Route = createFileRoute("/profile/progress")({
  component: ProgressRoute,
});
