import { base, type IconProps } from "./types";

export function ChevronDownIcon({ size, className, style }: IconProps) {
  return (
    <svg {...base(size, className, style)} aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
