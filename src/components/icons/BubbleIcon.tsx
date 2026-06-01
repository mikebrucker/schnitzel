import { type IconProps, base } from "./types";

export function BubbleIcon({ size = 20, className, style }: IconProps) {
  return (
    <svg {...base(size, className, style)} aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
