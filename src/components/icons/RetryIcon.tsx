import { base, type IconProps } from "./types";

export function RetryIcon({ size, strokeWidth, className, style }: IconProps) {
  return (
    <svg {...base(size, className, style, strokeWidth)} aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <polyline points="3 3 3 8 8 8" />
    </svg>
  );
}
