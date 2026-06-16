import { base, type IconProps } from "./types";

export function CheckIcon({ size, className, style }: IconProps) {
  return (
    <svg {...base(size, className, style)} aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
