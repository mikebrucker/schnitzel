import { type IconProps, base } from "./types";

export function GridIcon({ size, className, style }: IconProps) {
  return (
    <svg {...base(size, className, style)} aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}
