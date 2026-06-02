import { ChevronDownIcon, ChevronUpIcon } from "@/components/icons";
import { useState } from "react";
import type { ReactNode } from "react";

export type AccordionItem = {
  title: string;
  subtitle?: string;
  titleChips?: ReactNode;
  rightSlot?: ReactNode;
  content: ReactNode;
};

type BaseProps = {
  items: Array<AccordionItem>;
  round?: boolean;
};

type SingleProps = BaseProps & {
  multi?: false;
  defaultOpenIndex?: number;
  openIndex?: number | null;
  onOpenChange?: (i: number | null) => void;
};

type MultiProps = BaseProps & {
  multi: true;
  defaultOpenIndices?: Array<number>;
  openIndices?: Array<number>;
  onOpenChange?: (indices: Array<number>) => void;
};

type Props = SingleProps | MultiProps;

export function Accordion(props: Props) {
  const { items, round } = props;

  const [internalSingle, setInternalSingle] = useState<number | null>(
    !props.multi ? (props.defaultOpenIndex ?? null) : null,
  );
  const [internalMulti, setInternalMulti] = useState<Array<number>>(
    props.multi ? (props.defaultOpenIndices ?? []) : [],
  );

  const isOpen = (i: number): boolean => {
    if (props.multi) {
      const open = props.openIndices ?? internalMulti;
      return open.includes(i);
    }
    const open = props.openIndex !== undefined ? props.openIndex : internalSingle;
    return open === i;
  };

  const toggle = (i: number) => {
    if (props.multi) {
      const current = props.openIndices ?? internalMulti;
      const next = current.includes(i) ? current.filter((x) => x !== i) : [...current, i];
      if (props.openIndices === undefined) setInternalMulti(next);
      props.onOpenChange?.(next);
      return;
    }
    const current = props.openIndex !== undefined ? props.openIndex : internalSingle;
    const next = current === i ? null : i;
    if (props.openIndex === undefined) setInternalSingle(next);
    props.onOpenChange?.(next);
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const open = isOpen(i);
        return (
          <div
            key={item.title}
            className={`border-2 bd-default bg-surface${round ? " rounded-lg" : ""}`}
          >
            <button
              type="button"
              onClick={() => toggle(i)}
              className="w-full p-4 flex items-center gap-3 text-left"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-serif font-bold tx-text">{item.title}</span>
                  {item.titleChips ? item.titleChips : null}
                </div>
                {item.subtitle ? (
                  <div className="text-xs font-mono tx-muted mt-0.5">{item.subtitle}</div>
                ) : null}
              </div>
              {item.rightSlot ? item.rightSlot : null}
              <ChevronDownIcon
                className={`tx-muted shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-in-out"
              style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="border-t-2 bd-default">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
