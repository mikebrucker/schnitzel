import { base, type IconProps } from "./types";

export function GripIcon({ size, className, style }: IconProps) {
  return (
    <svg {...base(size, className, style)} fill="currentColor" stroke="none" aria-hidden="true">
      <circle cx="7" cy="5" r="2" />
      <circle cx="17" cy="5" r="2" />
      <circle cx="7" cy="12" r="2" />
      <circle cx="17" cy="12" r="2" />
      <circle cx="7" cy="19" r="2" />
      <circle cx="17" cy="19" r="2" />
    </svg>
  );
}
