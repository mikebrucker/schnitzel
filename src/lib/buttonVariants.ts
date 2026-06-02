export type ButtonVariant = "default" | "primary" | "accent" | "danger";
export type ButtonFill = "filled" | "outline" | "ghost";

export const BUTTON_VARIANTS: Record<ButtonVariant, Record<ButtonFill, string>> = {
  default: {
    filled: "bd-default bg-surface tx-text",
    outline: "bd-default tx-text",
    ghost: "tx-muted",
  },
  primary: {
    filled: "bd-btn bg-btn tx-btn",
    outline: "bd-btn tx-btn-bg",
    ghost: "tx-btn-bg",
  },
  accent: {
    filled: "bd-accent bg-accent-bg tx-accent",
    outline: "bd-accent tx-accent",
    ghost: "tx-accent",
  },
  danger: {
    filled: "border-red-600 bg-red-600 text-white",
    outline: "border-red-500 text-red-500",
    ghost: "tx-wrong",
  },
};
