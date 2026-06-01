import { useState } from "react";

export type AccordionItem = {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
};

type BaseProps = {
  items: Array<AccordionItem>;
  compact?: boolean;
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
  const { items, compact } = props;

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
    <div>
      {items.map((item, i) => {
        const open = isOpen(i);
        return (
          <div key={item.title}>
            <button
              type="button"
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between pr-4 py-4 text-left tx-text hover:opacity-80 transition-opacity"
            >
              <div className="flex-1 flex items-center gap-4 justify-between mr-4">
                <span
                  className={
                    compact
                      ? "font-serif font-bold tx-text"
                      : "font-serif text-2xl font-bold tx-text"
                  }
                >
                  {item.title}
                </span>
                {item.subtitle ? (
                  <span className="text-xs font-mono tx-muted">{item.subtitle}</span>
                ) : null}
              </div>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="tx-muted shrink-0 transition-transform duration-300"
                style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-in-out"
              style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="pt-1 tx-body text-sm leading-relaxed">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
