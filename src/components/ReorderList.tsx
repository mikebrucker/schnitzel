import { DotIcon, GripIcon } from "@/components/icons";
import { haptics } from "@/lib/haptics";
import type { ComponentType } from "react";
import { useRef, useState } from "react";

export type ReorderItem = {
  id: string;
  label: string;
  Icon: ComponentType;
};

interface Props {
  items: Array<ReorderItem>;
  selectedId?: string;
  selectLabel?: string;
  onReorder: (next: Array<ReorderItem>) => void;
  onSelect?: (id: string) => void;
}

const ITEM_H = 56;

export function ReorderList({
  items,
  selectedId,
  selectLabel = "default",
  onReorder,
  onSelect,
}: Props) {
  const [order, setOrder] = useState<Array<ReorderItem>>(items);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const [deltaY, setDeltaY] = useState(0);

  // refs avoid stale-closure issues in pointer event handlers
  const dragStateRef = useRef<{ from: number; over: number; startY: number } | null>(null);

  function getTranslateY(i: number): number {
    if (dragIdx === null || overIdx === null) return 0;
    if (i === dragIdx) return deltaY;
    if (dragIdx < overIdx && i > dragIdx && i <= overIdx) return -ITEM_H;
    if (dragIdx > overIdx && i >= overIdx && i < dragIdx) return ITEM_H;
    return 0;
  }

  function onGripDown(e: React.PointerEvent<HTMLDivElement>, i: number) {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStateRef.current = { from: i, over: i, startY: e.clientY };
    setDragIdx(i);
    setOverIdx(i);
    setDeltaY(0);
    haptics.tap();
  }

  function onGripMove(e: React.PointerEvent<HTMLDivElement>) {
    const ds = dragStateRef.current;
    if (!ds) return;
    const dy = e.clientY - ds.startY;
    const over = Math.max(0, Math.min(order.length - 1, Math.round(ds.from + dy / ITEM_H)));
    ds.over = over;
    setDeltaY(dy);
    setOverIdx(over);
  }

  function onGripUp() {
    const ds = dragStateRef.current;
    if (!ds) return;
    dragStateRef.current = null;
    if (ds.from !== ds.over) {
      const next = [...order];
      const [moved] = next.splice(ds.from, 1);
      next.splice(ds.over, 0, moved);
      setOrder(next);
      onReorder(next);
      haptics.tap();
    }
    setDragIdx(null);
    setOverIdx(null);
    setDeltaY(0);
  }

  function onGripCancel() {
    dragStateRef.current = null;
    setDragIdx(null);
    setOverIdx(null);
    setDeltaY(0);
  }

  return (
    <div
      className="relative overflow-hidden rounded-xl border-2 bd-default"
      style={{ height: ITEM_H * order.length }}
    >
      {order.map((item, i) => {
        const isDragging = dragIdx === i;
        const isSelected = item.id === selectedId;

        return (
          <div
            key={item.id}
            className={`absolute left-0 right-0 flex items-center gap-3 px-3 border-b bd-default last:border-b-0 ${isDragging ? "bg-surface-solid shadow-lg" : "bg-surface"}`}
            style={{
              top: i * ITEM_H,
              height: ITEM_H,
              transform: `translateY(${getTranslateY(i)}px)`,
              transition: isDragging ? "none" : "transform 180ms ease",
              zIndex: isDragging ? 10 : 1,
            }}
          >
            <div
              className="touch-none select-none cursor-grab active:cursor-grabbing p-2 tx-muted"
              onPointerDown={(e) => onGripDown(e, i)}
              onPointerMove={onGripMove}
              onPointerUp={onGripUp}
              onPointerCancel={onGripCancel}
            >
              <GripIcon />
            </div>
            <span className="tx-muted flex-shrink-0">
              <item.Icon />
            </span>
            <span className="font-mono text-sm uppercase tracking-wider tx-text flex-1">
              {item.label}
            </span>
            {onSelect ? (
              <>
                {isSelected ? (
                  <span className="font-mono text-[10px] uppercase tracking-wider tx-accent px-2">
                    {selectLabel}
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    onSelect(item.id);
                    haptics.tap();
                  }}
                  className={`p-2 transition-colors ${isSelected ? "tx-accent" : "tx-muted"}`}
                >
                  <DotIcon filled={isSelected} />
                </button>
              </>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
