import { Card } from "./index";

interface HeroCardProps {
  eyebrow: string;
  breadcrumb: string;
  title: string;
  subtitle: string;
  onClick: () => void;
  chip?: { label: string; bgColor: string };
}

export function HeroCard({ eyebrow, breadcrumb, title, subtitle, onClick, chip }: HeroCardProps) {
  return (
    <Card variant="accent" padding="lg" className="w-full" onClick={onClick}>
      <Card.Title size="lg">{eyebrow}</Card.Title>
      <Card.Caption size="sm" className="tracking-wider mb-3 mt-0.5">
        {breadcrumb}
      </Card.Caption>
      <Card.Title size="lg">{title}</Card.Title>
      <Card.Subtitle className="mb-4">{subtitle}</Card.Subtitle>
      {chip && <Card.Chip style={{ backgroundColor: chip.bgColor }}>{chip.label}</Card.Chip>}
    </Card>
  );
}
