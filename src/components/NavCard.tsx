import { Card } from "@/components/card";
import { ChevronRightIcon } from "@/components/icons";

interface NavCardProps {
  title: string;
  subtitle: string;
  onClick: () => void;
  className?: string;
}

export function NavCard({ title, subtitle, onClick, className = "" }: NavCardProps) {
  return (
    <Card onClick={onClick} className={`w-full py-2 ${className}`.trim()}>
      <Card.Row align="center">
        <div>
          <Card.Title size="xs">{title}</Card.Title>
          <Card.Subtitle size="xs">{subtitle}</Card.Subtitle>
        </div>
        <ChevronRightIcon size={16} className="tx-muted" />
      </Card.Row>
    </Card>
  );
}
