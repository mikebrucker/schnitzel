import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

type CardVariant = "accent" | "default";
type CardPadding = "sm" | "md" | "lg";

interface CardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  onClick?: () => void;
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<CardVariant, string> = {
  accent: "border-2 bd-accent bg-accent-bg",
  default: "border-2 bd-default bg-surface",
};

const PADDING_CLASSES: Record<CardPadding, string> = {
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function Card({
  variant = "default",
  padding = "md",
  onClick,
  style,
  className = "",
  children,
}: CardProps) {
  const base = `text-left rounded-xl shadow-card-md ${VARIANT_CLASSES[variant]} ${PADDING_CLASSES[padding]}`;
  const interactive = onClick
    ? "transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer hover:shadow-card-md"
    : "";
  const combined = `${base} ${interactive} ${className}`.trim();

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={combined} style={style}>
        {children}
      </button>
    );
  }

  return (
    <div className={combined} style={style}>
      {children}
    </div>
  );
}

// --- Sub-components ---

interface LabelProps {
  children: ReactNode;
  className?: string;
}

Card.Label = function CardLabel({ children, className = "" }: LabelProps) {
  return (
    <div className={`text-xs font-mono uppercase tracking-wider tx-muted mb-2 ${className}`.trim()}>
      {children}
    </div>
  );
};

type TitleSize = "xs" | "sm" | "md" | "lg";

const TITLE_SIZE_CLASSES: Record<TitleSize, string> = {
  xs: "text-base",
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
};

interface TitleProps {
  children: ReactNode;
  size?: TitleSize;
  className?: string;
}

Card.Title = function CardTitle({ children, size = "md", className = "" }: TitleProps) {
  return (
    <div
      className={`font-serif font-black tx-text mb-1 ${TITLE_SIZE_CLASSES[size]} ${className}`.trim()}
    >
      {children}
    </div>
  );
};

type SubtitleSize = "xs" | "sm" | "md" | "lg";

const SUBTITLE_SIZE_CLASSES: Record<SubtitleSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

interface SubtitleProps {
  children: ReactNode;
  size?: SubtitleSize;
  className?: string;
}

Card.Subtitle = function CardSubtitle({ children, size = "sm", className = "" }: SubtitleProps) {
  return (
    <div className={`tx-muted ${SUBTITLE_SIZE_CLASSES[size]} ${className}`.trim()}>{children}</div>
  );
};

interface RowProps {
  children: ReactNode;
  align?: "start" | "center";
  className?: string;
}

Card.Row = function CardRow({ children, align = "start", className = "" }: RowProps) {
  const alignClass = align === "center" ? "items-center" : "items-start";
  return <div className={`flex justify-between ${alignClass} ${className}`.trim()}>{children}</div>;
};

interface BadgeProps {
  children: ReactNode;
  accent?: boolean;
  className?: string;
}

Card.Badge = function CardBadge({ children, accent = false, className = "" }: BadgeProps) {
  const color = accent ? "tx-accent" : "tx-muted";
  return (
    <div className={`font-mono text-sm font-bold ${color} ${className}`.trim()}>{children}</div>
  );
};

type CaptionSize = "xs" | "sm";

interface CaptionProps {
  children: ReactNode;
  size?: CaptionSize;
  className?: string;
}

Card.Caption = function CardCaption({ children, size = "xs", className = "" }: CaptionProps) {
  const sizeClass = size === "sm" ? "text-sm" : "text-xs";
  return <div className={`${sizeClass} font-mono tx-muted ${className}`.trim()}>{children}</div>;
};

interface ChipProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}

Card.Chip = function CardChip({ children, style, className = "" }: ChipProps) {
  return (
    <div
      className={`inline-block rounded-full font-mono text-sm px-3 py-1 ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  );
};

interface BubbleProps {
  size: number;
  left: string;
  bottom: string;
  anim: string;
  duration: string;
  delay: string;
}

const CardProgressPillBubble = forwardRef<HTMLDivElement, BubbleProps>(
  function CardProgressPillBubble({ size, left, bottom, anim, duration, delay }, ref) {
    return (
      <div
        ref={ref}
        className="liquid-bubble"
        style={{
          width: size,
          height: size,
          left,
          bottom,
          animationName: anim,
          animationDuration: duration,
          animationDelay: delay,
        }}
      />
    );
  },
);

export interface ProgressPillProps {
  label: string;
  value: number;
  max: number;
  fillColor: string;
  length?: string | number;
  height?: string | number;
  bubbles?: number;
  shakeFactor?: number;
  className?: string;
}

function CardProgressPill({
  label,
  value,
  max,
  fillColor,
  length,
  height,
  bubbles,
  shakeFactor = 0,
  className = "",
}: ProgressPillProps) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const baseCount = Math.min(bubbles ?? 0, 128);
  const maxCount = Math.min(baseCount * 2, 128);
  const bubbleConfigs = useMemo(
    () =>
      Array.from({ length: maxCount }, () => {
        const size = 2 + Math.random() * 12;
        const left = `${(1 + Math.random() * 99).toFixed(1)}%`;
        const bottom = `${(10 + Math.random() * 80).toFixed(1)}%`;
        const duration = `${(5.0 + Math.random() * 4.0).toFixed(1)}s`;
        const delay = `${(Math.random() * 3.0).toFixed(2)}s`;
        const anim = Math.random() > 0.5 ? "bubble-up" : "bubble-down";
        const key = Math.random().toString(36).slice(2, 8);
        const freqX = 1.5 + Math.random() * 3.5;
        const freqY = 1.5 + Math.random() * 3.5;
        const phaseX = Math.random() * Math.PI * 2;
        const phaseY = Math.random() * Math.PI * 2;
        const ampX = 2 + Math.random() * 5;
        const ampY = 1 + Math.random() * 4;
        return {
          key,
          size,
          left,
          bottom,
          duration,
          delay,
          anim,
          freqX,
          freqY,
          phaseX,
          phaseY,
          ampX,
          ampY,
        };
      }),
    [maxCount],
  );

  const bubbleRefs = useRef<Array<HTMLDivElement | null>>([]);
  const shakeRef = useRef(shakeFactor);
  const activeCountRef = useRef(baseCount);
  const tRef = useRef(0);
  const popStateRef = useRef<
    Array<{
      nextPopAt: number;
      popStart: number | null;
      left: number;
      bottom: number;
      active: boolean;
    }>
  >([]);

  useEffect(() => {
    shakeRef.current = shakeFactor;
    const next = baseCount + Math.round(shakeFactor * baseCount);
    const prev = activeCountRef.current;
    activeCountRef.current = next;
    for (let i = prev; i < next && i < popStateRef.current.length; i++) {
      const state = popStateRef.current[i];
      if (state && !state.active) {
        state.active = true;
        state.left = 1 + Math.random() * 98;
        state.bottom = 10 + Math.random() * 80;
        state.nextPopAt = tRef.current + Math.random() * 0.5;
        state.popStart = null;
      }
    }
    for (let i = next; i < prev && i < popStateRef.current.length; i++) {
      const state = popStateRef.current[i];
      if (state) state.active = false;
    }
  }, [shakeFactor, baseCount]);

  useEffect(() => {
    popStateRef.current = Array.from({ length: maxCount }, (_, i) => ({
      nextPopAt: 0.5 + Math.random() * 6,
      popStart: null,
      left: Number.parseFloat(bubbleConfigs[i].left),
      bottom: Number.parseFloat(bubbleConfigs[i].bottom),
      active: i < baseCount,
    }));
    activeCountRef.current = baseCount;
  }, [maxCount, baseCount, bubbleConfigs]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: bubbleConfigs is stable from useMemo
  useEffect(() => {
    if (maxCount === 0) return;
    const POP_DURATION = 0.25;
    const start = performance.now();
    let raf: number;
    const tick = () => {
      const sf = shakeRef.current;
      const t = (performance.now() - start) / 1000;
      tRef.current = t;
      bubbleConfigs.forEach((b, i) => {
        const el = bubbleRefs.current[i];
        const state = popStateRef.current[i];
        if (!el || !state) return;
        if (!state.active) {
          el.style.opacity = "0";
          el.style.scale = "0";
          return;
        }
        const driftAmp = 0.35 + sf * 4;
        const x = Math.sin(t * b.freqX * 0.35 + b.phaseX) * b.ampX * driftAmp;
        const y = Math.cos(t * b.freqY * 0.35 + b.phaseY) * b.ampY * driftAmp;
        el.style.left = `${state.left.toFixed(1)}%`;
        el.style.bottom = `${state.bottom.toFixed(1)}%`;
        el.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
        if (state.popStart !== null) {
          const popT = t - state.popStart;
          if (popT < POP_DURATION) {
            el.style.scale = (1 + (popT / POP_DURATION) * 0.6).toFixed(3);
            el.style.opacity = (1 - popT / POP_DURATION).toFixed(3);
          } else {
            el.style.opacity = "";
            el.style.scale = "1";
            state.left = 1 + Math.random() * 98;
            state.bottom = 10 + Math.random() * 80;
            state.popStart = null;
            const minDelay = 0.3 + Math.random() * 0.7;
            const maxDelay = 5 + Math.random() * 8;
            state.nextPopAt = t + minDelay + maxDelay * (1 - sf);
          }
        } else {
          el.style.scale = (1 + Math.sin(t * b.freqX * 0.35 + b.phaseY) * sf * 0.5).toFixed(3);
          if (t >= state.nextPopAt) {
            state.popStart = t;
          }
        }
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [maxCount]);

  return (
    <div
      className={`relative inline-block overflow-hidden rounded-full font-mono text-sm  bg-surface-solid ${className}`.trim()}
      style={{ width: length, height }}
    >
      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={
          {
            width: mounted ? `${pct}%` : "0%",
            backgroundColor: fillColor,
            transition: "width 700ms ease-out",
            "--shake": shakeFactor,
          } as React.CSSProperties
        }
      >
        {bubbleConfigs.map((b, i) => (
          <CardProgressPillBubble
            key={b.key}
            ref={(el) => {
              bubbleRefs.current[i] = el;
            }}
            size={b.size}
            left={b.left}
            bottom={b.bottom}
            anim={b.anim}
            duration={b.duration}
            delay={b.delay}
          />
        ))}
      </div>
      <span className="relative z-10 w-full block text-center">{label}</span>
    </div>
  );
}

Card.ProgressPill = Object.assign(CardProgressPill, { Bubble: CardProgressPillBubble });

interface ProgressProps {
  value: number;
  max: number;
  className?: string;
}

Card.Progress = function CardProgress({ value, max, className = "" }: ProgressProps) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div className={`mt-3 w-full h-1 bg-surface-solid ${className}`.trim()}>
      <div
        className="h-full"
        style={{
          width: mounted ? `${pct}%` : "0%",
          backgroundColor: "var(--accent-border)",
          transition: "width 700ms ease-out",
        }}
      />
    </div>
  );
};
