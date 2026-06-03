import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <button
        type="button"
        className="absolute inset-0 w-full h-full cursor-default"
        style={{ background: "rgba(0,0,0,0.6)" }}
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative bg-surface-solid rounded-2xl p-6 mx-4 w-full max-w-sm">
        {children}
      </div>
    </div>
  );
}
