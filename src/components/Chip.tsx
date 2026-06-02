import { BUTTON_VARIANTS, type ButtonFill, type ButtonVariant } from "@/lib/buttonVariants";

interface ChipProps {
  label: string;
  variant?: ButtonVariant;
  fill?: ButtonFill;
  className?: string;
}

export function Chip({ label, variant = "accent", fill = "outline", className = "" }: ChipProps) {
  return (
    <span
      className={`text-xs font-mono border rounded-full px-2 py-1 leading-none self-center inline-flex items-center ${BUTTON_VARIANTS[variant][fill]} ${className}`}
    >
      {label}
    </span>
  );
}
