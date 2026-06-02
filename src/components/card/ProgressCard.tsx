import { Button } from "@/components/Button";
import { Card } from "@/components/card";
import { RetryIcon } from "@/components/icons";
import { scoreCardBg, scoreFillColor } from "@/lib/scoreColors";
import type { Lesson, LessonStat, Theme } from "@/lib/types";

interface ProgressCardProps {
  lesson: Lesson;
  stat: LessonStat | null;
  theme: Theme;
  onReset?: () => void;
}

export function ProgressCard({ lesson, stat, theme, onReset }: ProgressCardProps) {
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
        <div className="flex items-center gap-2 shrink-0 ml-3">
          {!stat ? <div className="font-mono text-xs tx-muted">not started</div> : null}
          {onReset ? (
            <Button
              label="Reset"
              variant="danger"
              size="sm"
              icon={<RetryIcon />}
              onClick={onReset}
            />
          ) : null}
        </div>
      </Card.Row>
      {stat ? (
        <Card.ProgressPill
          value={stat.finished ? stat.score : stat.answered}
          max={stat.total}
          fillColor={pct !== null ? scoreFillColor(pct, dark) : "var(--muted)"}
          length="100%"
          label={`${stat.score}/${stat.total} · ${pct}%`}
          className="mt-2 px-3 bd-default border-2"
        />
      ) : null}
    </Card>
  );
}
