import { type InputHTMLAttributes, useState } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  label?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

const FIELD_BASE = "w-full bg-surface border-2 bd-default tx-text px-3 py-2";

export function Input({
  label,
  className = "",
  defaultValue = "",
  onChange,
  ...props
}: InputProps) {
  const [value, setValue] = useState(defaultValue);
  const cls = `${FIELD_BASE} ${className}`;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    onChange?.(e.target.value);
  }

  const input = <input className={cls} value={value} onChange={handleChange} {...props} />;

  return label ? (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-mono uppercase tracking-wider tx-muted">{label}</span>
      {input}
    </div>
  ) : (
    input
  );
}
