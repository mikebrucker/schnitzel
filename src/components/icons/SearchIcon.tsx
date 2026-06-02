import { type IconProps, base } from "./types";

export function SearchIcon({ size, className, style }: IconProps) {
  return (
    <svg {...base(size, className, style)} aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
