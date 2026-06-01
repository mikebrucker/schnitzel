import { Card } from "./index";

interface HeroCardProps {
  eyebrow?: string;
  breadcrumb: string;
  title: string;
  subtitle: string;
  size?: "md" | "lg";
  onClick: () => void;
  chip?: { label: string; bgColor: string };
}

export function HeroCard({
  eyebrow,
  breadcrumb,
  title,
  subtitle,
  size = "lg",
  onClick,
  chip,
}: HeroCardProps) {
  return (
    <Card variant="accent" padding={size} className="w-full" onClick={onClick}>
      {eyebrow && <Card.Title size={size}>{eyebrow}</Card.Title>}
      <Card.Caption size="sm" className="tracking-wider mb-3 mt-0.5">
        {breadcrumb}
      </Card.Caption>
      <Card.Title size={size}>{title}</Card.Title>
      <Card.Subtitle className="mb-4">{subtitle}</Card.Subtitle>
      {chip && <Card.Chip style={{ backgroundColor: chip.bgColor }}>{chip.label}</Card.Chip>}
    </Card>
  );
}
