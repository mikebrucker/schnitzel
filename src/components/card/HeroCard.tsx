import { useEffect, useRef, useState } from "react";
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
    bubbles?: number;
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
  const [shakeFactor, setShakeFactor] = useState(0);
  const shakeRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastMouseRef = useRef<{ x: number; y: number; t: number } | null>(null);

  const startDecay = () => {
    if (rafRef.current !== null) return;
    const tick = () => {
      shakeRef.current *= 0.88;
      if (shakeRef.current < 0.005) {
        shakeRef.current = 0;
        setShakeFactor(0);
        rafRef.current = null;
        return;
      }
      setShakeFactor(shakeRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: startDecay only touches refs
  useEffect(() => {
    if (!progressPill?.bubbles) return;
    shakeRef.current = 1;
    setShakeFactor(1);
    startDecay();
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const now = Date.now();
    const prev = lastMouseRef.current;
    if (prev) {
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      const dt = Math.max(now - prev.t, 1);
      const v = Math.sqrt(dx * dx + dy * dy) / dt;
      shakeRef.current = Math.min(1, shakeRef.current + v * 0.08);
      setShakeFactor(shakeRef.current);
      startDecay();
    }
    lastMouseRef.current = { x: e.clientX, y: e.clientY, t: now };
  };

  const handleMouseEnter = () => {
    shakeRef.current = Math.max(shakeRef.current, 0.3);
    setShakeFactor(shakeRef.current);
    startDecay();
  };

  const handleMouseLeave = () => {
    lastMouseRef.current = null;
  };

  return (
    <div
      onMouseMove={progressPill?.bubbles ? handleMouseMove : undefined}
      onMouseEnter={progressPill?.bubbles ? handleMouseEnter : undefined}
      onMouseLeave={progressPill?.bubbles ? handleMouseLeave : undefined}
    >
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
            bubbles={progressPill.bubbles}
            shakeFactor={shakeFactor}
            className="py-2 border-2 bd-default"
          >
            {progressPill.label}
          </Card.ProgressPill>
        ) : null}
      </Card>
    </div>
  );
}
