import type { IconProps } from "@/components/icons/types";
import { BUTTON_VARIANTS, type ButtonVariant } from "@/lib/buttonVariants";
import type { ComponentType } from "react";

interface HeaderAction {
  label: string;
  icon: ComponentType<IconProps>;
  onClick: () => void;
  variant?: ButtonVariant;
}

interface HeaderProps {
  title: string;
  subtitle?: string;
  secondaryAction?: HeaderAction;
  primaryAction?: HeaderAction;
}

export function Header({ title, subtitle, secondaryAction, primaryAction }: HeaderProps) {
  const hasActions = secondaryAction !== undefined || primaryAction !== undefined;

  return (
    <header className="sticky z-50 border-b-4 bd-default bg-header" style={{ top: 'var(--safe-top)' }}>
      <div
        className={`max-w-4xl mx-auto px-4 min-h-20 items-center ${hasActions ? "grid grid-cols-[1fr_auto_1fr]" : "flex"}`}
      >
        {hasActions ? (
          <div className="flex justify-start">
            {secondaryAction ? (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                className={`flex items-center gap-2 text-sm font-mono pr-2 py-1 whitespace-nowrap ${BUTTON_VARIANTS[secondaryAction.variant ?? "default"].ghost}`}
              >
                <secondaryAction.icon size={20} />
                {secondaryAction.label}
              </button>
            ) : null}
          </div>
        ) : null}

        <div className={hasActions ? "text-center" : ""}>
          <div className="font-serif text-xl font-black tracking-tight tx-text leading-tight">
            {title}
          </div>
          {subtitle ? <div className="text-xs font-mono tx-muted">{subtitle}</div> : null}
        </div>

        {hasActions ? (
          <div className="flex justify-end">
            {primaryAction ? (
              <button
                type="button"
                onClick={primaryAction.onClick}
                className={`flex items-center gap-2 text-sm font-mono pl-2 py-1 whitespace-nowrap ${BUTTON_VARIANTS[primaryAction.variant ?? "accent"].ghost}`}
              >
                {primaryAction.label}
                <primaryAction.icon size={20} />
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </header>
  );
}
