import { Button } from "@/components/Button";
import type { ButtonVariant } from "@/lib/buttonVariants";
export type AlertAction = {
  label: string;
  variant?: ButtonVariant;
  onClick: () => void;
};

interface AlertProps {
  title: string;
  subtitle?: string;
  message?: string;
  actions: Array<AlertAction>;
  onDismiss?: () => void;
}

export function Alert({ title, subtitle, message, actions, onDismiss }: AlertProps) {
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop dismiss is a convenience affordance; keyboard users use the Cancel button
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6" onClick={onDismiss}>
      <div className="absolute inset-0 bg-black/60" />
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: stop-propagation only, not an interactive element */}
      <div
        className="relative w-full max-w-sm rounded-2xl border-2 bd-default bg-surface-solid p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h2 className="font-serif text-xl font-bold tx-text">{title}</h2>
          {subtitle ? <p className="text-sm tx-muted mt-0.5">{subtitle}</p> : null}
        </div>
        {message ? <p className="text-sm tx-body whitespace-pre-line">{message}</p> : null}
        <div className="flex gap-2 pt-1">
          {actions.map((action) => (
            <Button
              key={action.label}
              label={action.label}
              variant={action.variant ?? "default"}
              fill={action.variant === "danger" ? "filled" : "outline"}
              onClick={action.onClick}
              className="flex-1"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
