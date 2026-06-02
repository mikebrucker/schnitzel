import { Header } from "@/components/Header";
import { ProgressCard } from "@/components/card/ProgressCard";
import { ChevronLeftIcon } from "@/components/icons";
import { CURRICULUM } from "@/lib/curriculum";
import { haptics } from "@/lib/haptics";
import { loadQuizProgress } from "@/lib/quizStorage";
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

  const [lessonStats, setLessonStats] = useState<Array<LessonEntry>>([]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: completed triggers re-load when lesson state changes
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
  }, [completed]);

  return (
    <>
      <Header
        title="Fortschritt"
        subtitle="Per Lesson"
        secondaryAction={{
          label: "Profil",
          icon: <ChevronLeftIcon size={16} />,
          onClick: () => {
            haptics.tap();
            navigate({ to: "/profile" });
          },
        }}
      />
      <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
        {LEVEL_GROUPS.map((group) => (
          <section key={group.level}>
            <h2 className="font-bold border-b bd-default tx-muted text-xl tracking-widest mb-4 pb-1">
              Level {group.level.toLocaleUpperCase()}
            </h2>
            <div className="space-y-2">
              {group.entries.map(({ lesson, idx }) => (
                <ProgressCard
                  key={lesson.id}
                  lesson={lesson}
                  stat={lessonStats[idx] ?? null}
                  theme={theme}
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
