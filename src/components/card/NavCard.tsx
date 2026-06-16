import type { ReactNode } from "react";
import { Card } from "@/components/card";
import { ChevronRightIcon } from "@/components/icons";

interface NavCardProps {
  title: string;
  subtitle: string;
  onClick: () => void;
  icon?: ReactNode;
  className?: string;
}

export function NavCard({ title, subtitle, onClick, icon, className = "" }: NavCardProps) {
  return (
    <Card onClick={onClick} className={`w-full py-2 ${className}`.trim()}>
      <Card.Row align="center">
        <div className="flex items-center gap-3">
          {icon ? <span className="tx-muted shrink-0">{icon}</span> : null}
          <div>
            <Card.Title size="xs">{title}</Card.Title>
            <Card.Subtitle size="xs">{subtitle}</Card.Subtitle>
          </div>
        </div>
        <ChevronRightIcon className="tx-muted" />
      </Card.Row>
    </Card>
  );
}
