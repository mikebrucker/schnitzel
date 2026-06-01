import { base, type IconProps } from "./types";

export function ChevronLeftIcon({ size = 20, className, style }: IconProps) {
  return (
    <svg {...base(size, className, style)} aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
