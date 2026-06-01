import { Card } from "./index";

interface HeroCardProps {
  eyebrow?: string;
  breadcrumb: string;
  title: string;
  subtitle: string;
  size?: "md" | "lg";
  onClick: () => void;
  progressPill?: {
    label: string;
    value: number;
    max: number;
    fillColor: string;
    length?: string | number;
    height?: string | number;
  };
}

export function HeroCard({
  eyebrow,
  breadcrumb,
  title,
  subtitle,
  size = "lg",
  onClick,
  progressPill,
}: HeroCardProps) {
  return (
    <Card variant="accent" padding={size} className="w-full" onClick={onClick}>
      {eyebrow ? <Card.Title size={size}>{eyebrow}</Card.Title> : null}
      <Card.Caption size="sm" className="tracking-wider mb-3 mt-0.5">
        {breadcrumb}
      </Card.Caption>
      <Card.Title size={size}>{title}</Card.Title>
      <Card.Subtitle className="mb-4">{subtitle}</Card.Subtitle>
      {progressPill ? (
        <Card.ProgressPill
          value={progressPill.value}
          max={progressPill.max}
          fillColor={progressPill.fillColor}
          length={progressPill.length}
          height={progressPill.height}
        >
          {progressPill.label}
        </Card.ProgressPill>
      ) : null}
    </Card>
  );
}
