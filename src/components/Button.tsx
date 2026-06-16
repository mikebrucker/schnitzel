import type { ButtonHTMLAttributes, ReactNode } from "react";
import { BUTTON_VARIANTS, type ButtonFill, type ButtonVariant } from "@/lib/buttonVariants";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: ButtonVariant;
  fill?: ButtonFill;
  size?: "sm" | "md";
  icon?: ReactNode;
  iconSide?: "left" | "right";
}

const SIZES = {
  sm: "px-5 py-2 text-sm",
  md: "px-6 py-3",
};

export function Button({
  label,
  variant = "primary",
  fill = "filled",
  size = "md",
  icon,
  iconSide = "right",
  className = "",
  ...props
}: ButtonProps) {
  const borderClass = fill === "ghost" ? "" : "border-2";
  return (
    <button
      type="button"
      className={`${borderClass} rounded-lg font-bold flex items-center justify-center gap-2 ${BUTTON_VARIANTS[variant][fill]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {icon && iconSide === "left" ? icon : null}
      <span>{label}</span>
      {icon && iconSide === "right" ? icon : null}
    </button>
  );
}
