import { type IconProps, base } from "./types";

export function XIcon({ size = 20, className, style }: IconProps) {
  return (
    <svg {...base(size, className, style)} aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
