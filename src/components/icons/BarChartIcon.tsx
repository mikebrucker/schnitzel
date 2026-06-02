import { type IconProps, base } from "./types";

export function BarChartIcon({ size = 20, strokeWidth = 3, className, style }: IconProps) {
  return (
    <svg {...base(size, className, style, strokeWidth)} aria-hidden="true">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
