import { useEffect, useRef, useState } from "react";
import { Card, type ProgressPillProps } from "./index";

interface HeroCardProps {
  eyebrow?: string;
  breadcrumb: string;
  title: string;
  subtitle: string;
  size?: "md" | "lg";
  onClick: () => void;
  progressPill?: ProgressPillProps;
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
  const buildRafRef = useRef<number | null>(null);
  const lastMouseRef = useRef<{ x: number; y: number; t: number; vx: number; vy: number } | null>(
    null,
  );

  const startDecay = () => {
    if (rafRef.current !== null) return;
    let lastTick = performance.now();
    const tick = () => {
      const now = performance.now();
      const dt = (now - lastTick) / (1000 / 60);
      lastTick = now;
      shakeRef.current *= 0.994 ** dt;
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
    const dt = Math.max(now - (prev?.t ?? now), 1);
    const dx = e.clientX - (prev?.x ?? e.clientX);
    const dy = e.clientY - (prev?.y ?? e.clientY);
    const vx = dx / dt;
    const vy = dy / dt;
    const speed = Math.sqrt(vx * vx + vy * vy);
    if (prev && speed > 0) {
      const prevSpeed = Math.sqrt(prev.vx * prev.vx + prev.vy * prev.vy);
      const dot = prevSpeed > 0 ? (vx * prev.vx + vy * prev.vy) / (speed * prevSpeed) : 0;
      const boost = 1 + Math.max(0, -dot) * 2.5;
      shakeRef.current += speed * 0.15 * boost * (1 - shakeRef.current);
      setShakeFactor(shakeRef.current);
      startDecay();
    }
    lastMouseRef.current = { x: e.clientX, y: e.clientY, t: now, vx, vy };
  };

  const handleMouseEnter = () => {
    shakeRef.current += 0.2 * (1 - shakeRef.current);
    setShakeFactor(shakeRef.current);
    startDecay();
  };

  const handleMouseDown = () => {
    if (buildRafRef.current !== null) cancelAnimationFrame(buildRafRef.current);
    const startVal = shakeRef.current;
    const buildStart = performance.now();
    const buildDuration = 180;
    const buildTick = () => {
      const progress = Math.min((performance.now() - buildStart) / buildDuration, 1);
      const eased = 1 - (1 - progress) ** 2;
      shakeRef.current = startVal + (1 - startVal) * eased;
      setShakeFactor(shakeRef.current);
      if (progress < 1) {
        buildRafRef.current = requestAnimationFrame(buildTick);
      } else {
        buildRafRef.current = null;
        startDecay();
      }
    };
    buildRafRef.current = requestAnimationFrame(buildTick);
  };

  const handleMouseLeave = () => {
    lastMouseRef.current = null;
  };

  return (
    <div
      onMouseMove={progressPill?.bubbles ? handleMouseMove : undefined}
      onMouseEnter={progressPill?.bubbles ? handleMouseEnter : undefined}
      onMouseDown={progressPill?.bubbles ? handleMouseDown : undefined}
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
            label={progressPill.label}
            className="px-3 border-2 bd-default"
          />
        ) : null}
      </Card>
    </div>
  );
}
