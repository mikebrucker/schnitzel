import { Header } from "@/components/Header";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { CURRICULUM } from "@/lib/curriculum";
import { haptics } from "@/lib/haptics";
import { loadQuizProgress } from "@/lib/quizStorage";
import { scoreCardBg, scoreTextClass } from "@/lib/scoreColors";
import type { LessonStat } from "@/lib/types";
import { useApp } from "@/store/useApp";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type LessonEntry = (LessonStat & { id: number; title: string }) | null;

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
      <div className="max-w-4xl mx-auto px-4 py-4">
        <section>
          <div className="space-y-2">
            {CURRICULUM.map((lesson, i) => {
              const s = lessonStats[i];
              const pct = s?.finished ? Math.round((s.score / s.total) * 100) : null;
              return (
                <div
                  key={lesson.id}
                  className="border-2 bd-default px-4 py-3"
                  style={
                    s?.finished && pct !== null
                      ? { backgroundColor: scoreCardBg(pct, theme === "dark") }
                      : { backgroundColor: "var(--surface)" }
                  }
                >
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="font-mono font-bold tx-text text-sm uppercase tracking-wider">
                        {lesson.level} · U{lesson.unit} · L{lesson.lessonNum}
                      </span>
                      <span className="font-serif text-xs tx-muted ml-2">{lesson.title}</span>
                    </div>
                    {s?.finished ? (
                      <div
                        className={`font-mono font-bold text-sm shrink-0 ml-3 ${scoreTextClass(pct)}`}
                      >
                        {s.score}/{s.total} · {pct}%
                      </div>
                    ) : s ? (
                      <div className="font-mono text-xs tx-muted shrink-0 ml-3">
                        {s.answered}/{s.total}{" "}
                        <ChevronRightIcon size={12} className="inline-block" />
                      </div>
                    ) : (
                      <div className="font-mono text-xs tx-muted shrink-0 ml-3">not started</div>
                    )}
                  </div>
                  <div className="w-full h-1 bg-surface-solid mt-2">
                    {s?.finished && pct !== null ? (
                      <div
                        className="h-full"
                        style={{ width: `${pct}%`, backgroundColor: "var(--accent-border)" }}
                      />
                    ) : null}
                    {s && !s.finished ? (
                      <div
                        className="h-full opacity-40"
                        style={{
                          width: `${Math.round((s.answered / s.total) * 100)}%`,
                          backgroundColor: "var(--accent-border)",
                        }}
                      />
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}

export const Route = createFileRoute("/profile/progress")({
  component: ProgressRoute,
});
