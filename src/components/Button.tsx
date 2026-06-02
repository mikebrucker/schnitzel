import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "danger";
  size?: "sm" | "md";
  icon?: ReactNode;
  iconEnd?: ReactNode;
}

const VARIANTS = {
  default: "bd-default tx-text bg-surface",
  primary: "bd-btn bg-btn tx-btn",
  danger: "border-transparent bg-red-600 text-white",
};

const SIZES = {
  sm: "px-5 py-2 text-sm",
  md: "px-6 py-3",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconEnd,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`border-2 rounded-xl font-bold flex items-center justify-center gap-2 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {icon ? icon : null}
      {children}
      {iconEnd ? iconEnd : null}
    </button>
  );
}
