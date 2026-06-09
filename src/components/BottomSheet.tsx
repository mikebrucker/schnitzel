import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const MAX_UP = "20vh";

export function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dragY, setDragY] = useState(0);
  const dragStartY = useRef(0);
  const dragging = useRef(false);
  const dragPending = useRef(false);
  const dragYRef = useRef(0);
  const onCloseRef = useRef(onClose);
  const scrollRef = useRef<HTMLDivElement>(null);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const t = setTimeout(() => setMounted(false), 350);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const onMove = (clientY: number, e: TouchEvent | MouseEvent) => {
      const delta = clientY - dragStartY.current;

      if (dragPending.current) {
        if (Math.abs(delta) < 5) return;
        const scrollTop = scrollRef.current?.scrollTop ?? 0;
        if (scrollTop < 5) dragging.current = true;
        dragPending.current = false;
        if (!dragging.current) return;
      }

      if (!dragging.current) return;
      e.preventDefault();

      const maxUp = window.innerHeight * 0.2;
      const translated = delta >= 0 ? delta : Math.max(delta, -maxUp);
      dragYRef.current = translated;
      setDragY(translated);
    };

    const onEnd = () => {
      if (!dragging.current && !dragPending.current) return;
      dragging.current = false;
      dragPending.current = false;
      const dismissThreshold = window.innerHeight * 0.05;
      if (dragYRef.current > dismissThreshold) {
        onCloseRef.current();
      }
      dragYRef.current = 0;
      setDragY(0);
    };

    const onMouseMove = (e: MouseEvent) => onMove(e.clientY, e);
    const onTouchMove = (e: TouchEvent) => onMove(e.touches[0].clientY, e);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onEnd);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onEnd);
    };
  }, []);

  if (!mounted) return null;

  const sheetTransform = !visible
    ? "translateY(100%)"
    : dragY !== 0
      ? `translateY(${dragY}px)`
      : "translateY(0)";
  const sheetTransition = dragY !== 0 ? "none" : "transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)";

  const startDrag = (clientY: number) => {
    dragStartY.current = clientY;
    dragging.current = false;
    dragPending.current = true;
  };

  const startDragImmediate = (clientY: number) => {
    dragStartY.current = clientY;
    dragging.current = true;
    dragPending.current = false;
  };

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        className="absolute inset-0 w-full h-full cursor-default"
        style={{
          background: "rgba(0,0,0,0.6)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.35s ease",
        }}
        onClick={onClose}
        aria-label="Close"
      />
      <div
        className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto bg-surface-solid"
        style={{ height: MAX_UP, zIndex: 9 }}
      />
      <div
        ref={scrollRef}
        className="absolute bottom-0 left-0 right-0 z-10 max-w-4xl mx-auto bg-surface-solid rounded-t-2xl min-h-[65vh] max-h-[85vh] overflow-y-auto cursor-grab active:cursor-grabbing select-none"
        style={{
          paddingBottom: "var(--safe-bottom)",
          transform: sheetTransform,
          transition: sheetTransition,
          willChange: "transform",
          overscrollBehavior: "contain",
        }}
        onMouseDown={(e) => startDrag(e.clientY)}
        onTouchStart={(e) => startDrag(e.touches[0].clientY)}
      >
        <div
          className="flex justify-center pt-3 pb-2 sticky top-0 bg-surface-solid z-10 select-none cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => {
            e.stopPropagation();
            startDragImmediate(e.clientY);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            startDragImmediate(e.touches[0].clientY);
          }}
        >
          <div className="w-10 h-1 rounded-full" style={{ background: "var(--border)" }} />
        </div>
        {children}
      </div>
    </div>
  );
}
