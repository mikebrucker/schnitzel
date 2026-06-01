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
  const hasButtons = secondaryAction !== undefined || primaryAction !== undefined;

  return (
    <header className="border-b-4 bd-default bg-header">
      <div className="max-w-4xl mx-auto px-4 flex items-center gap-2 min-h-20">
        {hasButtons ? (
          <button
            type="button"
            onClick={secondaryAction?.onClick}
            className="flex items-center gap-1 text-sm font-mono tx-muted min-w-[5rem] shrink-0 disabled:opacity-0"
            disabled={!secondaryAction}
          >
            {secondaryAction?.icon}
            {secondaryAction?.label}
          </button>
        ) : null}

        <div className={`flex-1 ${hasButtons ? "text-center" : ""}`}>
          <div className="font-serif text-xl font-black tracking-tight tx-text leading-tight">
            {title}
          </div>
          {subtitle && <div className="text-xs font-mono tx-muted">{subtitle}</div>}
        </div>

        {hasButtons ? (
          <button
            type="button"
            onClick={primaryAction?.onClick}
            className="flex items-center gap-1 text-sm font-mono tx-accent min-w-[5rem] justify-end shrink-0 disabled:opacity-0"
            disabled={!primaryAction}
          >
            {primaryAction?.label}
            {primaryAction?.icon}
          </button>
        ) : null}
      </div>
    </header>
  );
}
