import { useState } from "react";

export type AccordionItem = {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
};

type Props = {
  items: Array<AccordionItem>;
};

export function Accordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.title} className={i > 0 ? "border-t-2 bd-default" : ""}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between pr-4 py-4 text-left tx-text hover:opacity-80 transition-opacity"
            >
              <div className="flex-1 flex items-center gap-4 justify-between mr-4">
                <span className="font-serif font-bold">{item.title}</span>
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
                style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-in-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="pb-5 pt-1 tx-body text-sm leading-relaxed border-t bd-default">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
