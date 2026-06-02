import { Card } from "@/components/card";
import { scoreCardBg } from "@/lib/scoreColors";
import type { Lesson, LessonStat, Theme } from "@/lib/types";

interface ProgressCardProps {
  lesson: Lesson;
  stat: LessonStat | null;
  theme: Theme;
}

export function ProgressCard({ lesson, stat, theme }: ProgressCardProps) {
  const pct = stat ? Math.round(((stat.score ?? stat?.answered) / stat.total) * 100) : null;
  const dark = theme === "dark";

  return (
    <Card
      padding="sm"
      style={
        stat?.finished && pct !== null ? { backgroundColor: scoreCardBg(pct, dark) } : undefined
      }
    >
      <Card.Row align="center">
        <div>
          <Card.Title size="xs">Unit {lesson.unit}</Card.Title>
          <Card.Subtitle size="xs">
            Lesson {lesson.lessonNum}: {lesson.title}
          </Card.Subtitle>
        </div>
        {!stat ? <div className="font-mono text-xs tx-muted shrink-0 ml-3">not started</div> : null}
      </Card.Row>
      {stat ? (
        <Card.ProgressPill
          value={stat.finished ? stat.score : stat.answered}
          max={stat.total}
          fillColor={pct !== null ? scoreCardBg(pct, dark) : "var(--muted)"}
          length="100%"
          height={28}
          className="mt-2"
        >
          {stat.score}/{stat.total} · {pct}%
        </Card.ProgressPill>
      ) : null}
    </Card>
  );
}
