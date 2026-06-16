import { base, type IconProps } from "./types";

export function ChevronRightIcon({ size, className, style }: IconProps) {
  return (
    <svg {...base(size, className, style)} aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
