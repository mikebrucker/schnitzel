import { Card } from "@/components/card";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}

export function StatCard({ label, value, sub, accent = false }: StatCardProps) {
  return (
    <Card variant={accent ? "accent" : "default"} padding="sm">
      <Card.Label>{label}</Card.Label>
      <div className={`font-serif text-3xl font-black ${accent ? "tx-accent" : "tx-text"}`}>
        {value}
      </div>
      {sub ? <Card.Caption className="mt-1">{sub}</Card.Caption> : null}
    </Card>
  );
}
