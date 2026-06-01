import { Card } from "./index";

interface SummaryCardProps {
  title: string;
  description: string;
  badge: string;
  badgeAccent?: boolean;
  meta: string;
  progress: { value: number; max: number };
  onClick: () => void;
}

export function SummaryCard({
  title,
  description,
  badge,
  badgeAccent = false,
  meta,
  progress,
  onClick,
}: SummaryCardProps) {
  return (
    <Card onClick={onClick}>
      <Card.Row className="mb-3">
        <div>
          <Card.Title size="lg" className="mb-0">
            {title}
          </Card.Title>
          <Card.Caption className="mt-0.5">{description}</Card.Caption>
        </div>
        <Card.Badge accent={badgeAccent}>{badge}</Card.Badge>
      </Card.Row>
      <Card.Caption>{meta}</Card.Caption>
      <Card.Progress value={progress.value} max={progress.max} />
    </Card>
  );
}
