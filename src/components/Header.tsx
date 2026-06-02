import type { ReactNode } from "react";

interface HeaderAction {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  color?: "default" | "danger";
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
    <header className="border-b-4 bd-default bg-header">
      <div
        className={`max-w-4xl mx-auto px-4 min-h-20 items-center ${hasActions ? "grid grid-cols-[1fr_auto_1fr]" : "flex"}`}
      >
        {hasActions ? (
          <div className="flex justify-start">
            {secondaryAction ? (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                className="flex items-center gap-2 text-sm font-mono tx-muted pr-2 py-1 whitespace-nowrap"
              >
                {secondaryAction.icon}
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
                className={`flex items-center gap-2 text-sm font-mono pl-2 py-1 whitespace-nowrap ${primaryAction.color === "danger" ? "tx-wrong" : "tx-accent"}`}
              >
                {primaryAction.label}
                {primaryAction.icon}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </header>
  );
}
