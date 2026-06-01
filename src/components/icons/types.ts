import type { CSSProperties } from "react";

export interface IconProps {
  size?: number;
  className?: string;
  style?: CSSProperties;
}

export function base(size: number, className?: string, style?: CSSProperties) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    style,
  };
}
