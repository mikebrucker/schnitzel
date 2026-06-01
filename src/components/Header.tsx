import type { ReactNode } from "react";

interface HeaderAction {
  label: string;
  icon: ReactNode;
  onClick: () => void;
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
        className={`max-w-4xl mx-auto px-4 min-h-20 items-center ${hasActions ? "grid grid-cols-[5rem_1fr_5rem]" : "flex"}`}
      >
        {hasActions ? (
          <div>
            {secondaryAction ? (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                className="flex items-center gap-1 text-sm font-mono tx-muted"
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
                className="flex items-center gap-1 text-sm font-mono tx-accent"
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
