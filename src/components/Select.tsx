import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@/components/icons";

interface SelectProps<K extends string> {
  options: Record<K, string>;
  value?: K;
  defaultValue?: K;
  onChange?: (value: K) => void;
  label?: string;
  className?: string;
}

export function Select<K extends string>({
  options,
  value,
  defaultValue,
  onChange,
  label,
  className = "",
}: SelectProps<K>) {
  const [selected, setSelected] = useState<K>(
    (value ?? defaultValue ?? Object.keys(options)[0] ?? "") as K,
  );
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) setSelected(value);
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const pick = (val: K) => {
    setSelected(val);
    onChange?.(val);
    setOpen(false);
  };

  const dropdown = (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full bg-surface border-2 bd-default tx-text px-3 py-2 rounded-lg flex items-center justify-between gap-2"
      >
        <span>{options[selected] ?? selected}</span>
        <span className={`tx-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <ChevronDownIcon />
        </span>
      </button>

      <div
        className={`absolute z-50 top-full mt-1 w-full overflow-hidden transition-all duration-500 rounded-lg ${
          open ? "max-h-96 pointer-events-auto" : "max-h-0 pointer-events-none"
        }`}
      >
        <div className="bg-surface-solid border-2 bd-default rounded-lg overflow-hidden">
          {(Object.entries(options) as Array<[K, string]>).map(([val, lbl], i) => (
            <button
              key={val}
              type="button"
              onClick={() => pick(val)}
              className={`w-full text-left px-3 py-2 font-mono text-sm transition-colors ${
                val === selected
                  ? "bg-accent-bg tx-accent font-bold"
                  : i % 2 === 0
                    ? "tx-text bg-surface-solid"
                    : "tx-text bg-white/5"
              }`}
            >
              {lbl}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return label ? (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-mono uppercase tracking-wider tx-muted">{label}</span>
      {dropdown}
    </div>
  ) : (
    dropdown
  );
}
