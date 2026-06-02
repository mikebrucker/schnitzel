import { type IconProps, base } from "./types";

export function RetryIcon({ size, className, style }: IconProps) {
  return (
    <svg {...base(size, className, style)} aria-hidden="true">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
    </svg>
  );
}
