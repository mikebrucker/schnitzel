export function scoreCardBg(pct: number, dark: boolean): string {
  const hue = Math.round(pct * 1.2);
  return dark ? `hsl(${hue}, 25%, 16%)` : `hsl(${hue}, 30%, 90%)`;
}

export function scoreFillColor(pct: number, dark: boolean): string {
  const hue = Math.round(pct * 1.2);
  return dark ? `hsl(${hue}, 65%, 28%)` : `hsl(${hue}, 60%, 68%)`;
}

export function scoreTextClass(pct: number | null): string {
  if (pct === null) return "tx-accent";
  if (pct >= 80) return "tx-accent";
  if (pct >= 60) return "tx-score-high";
  if (pct >= 40) return "tx-score-mid";
  if (pct >= 20) return "tx-score-low";
  return "tx-wrong";
}
