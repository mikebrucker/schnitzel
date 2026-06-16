import { base, type IconProps } from "./types";

interface DotIconProps extends IconProps {
  filled?: boolean;
}

export function DotIcon({ size, className, style, filled = false }: DotIconProps) {
  return filled ? (
    <svg {...base(size, className, style)} fill="currentColor" stroke="none" aria-hidden="true">
      <circle cx="12" cy="12" r="7" />
    </svg>
  ) : (
    <svg {...base(size, className, style)} aria-hidden="true">
      <circle cx="12" cy="12" r="7" />
    </svg>
  );
}
