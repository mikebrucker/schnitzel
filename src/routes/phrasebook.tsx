import { Accordion } from "@/components/Accordion";
import type { AccordionItem } from "@/components/Accordion";
import { Chip } from "@/components/Chip";
import { Header } from "@/components/Header";
import { Card } from "@/components/card";
import { PHRASEBOOK } from "@/lib/curriculum";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

const FORMALITY_LABEL: Record<string, string> = {
  formal: "formal",
  neutral: "neutral",
  casual: "casual",
};

function PhrasebookRoute() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PHRASEBOOK;
    return PHRASEBOOK.filter(
      (p) =>
        p.de.toLowerCase().includes(q) ||
        p.en.toLowerCase().includes(q) ||
        p.literal?.toLowerCase().includes(q),
    );
  }, [query]);

  const categories = useMemo(() => {
    const seen = new Set<string>();
    const order: Array<string> = [];
    for (const p of filtered) {
      if (!seen.has(p.category)) {
        seen.add(p.category);
        order.push(p.category);
      }
    }
    return order;
  }, [filtered]);

  const items: Array<AccordionItem> = categories.map((cat) => {
    const phrases = filtered.filter((p) => p.category === cat);
    return {
      title: cat.charAt(0).toUpperCase() + cat.slice(1),
      subtitle: `${phrases.length} phrase${phrases.length === 1 ? "" : "s"}`,
      content: (
        <div className="p-3 space-y-2">
          {phrases.map((p) => (
            <Card key={p.id} padding="sm">
              <div className="flex items-start justify-between gap-3 mb-1">
                <span className="font-serif font-bold tx-text">{p.de}</span>
                <Chip label={FORMALITY_LABEL[p.formality] ?? p.formality} />
              </div>
              <div className="tx-body text-sm">{p.en}</div>
              {p.literal !== null ? (
                <div className="text-xs tx-muted font-mono mt-1 italic">
                  lit. &ldquo;{p.literal}&rdquo;
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      ),
    };
  });

  return (
    <>
      <Header title="Phrasebuch" subtitle="Phrasebook" />
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="mb-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search phrases…"
            className="w-full border-2 bd-default bg-surface tx-body px-4 py-3 font-mono text-sm outline-none focus:bd-accent"
          />
        </div>

        {items.length === 0 ? (
          <div className="tx-muted font-mono text-sm py-8 text-center">Nichts gefunden.</div>
        ) : (
          <Accordion items={items} defaultOpenIndex={0} round={true} />
        )}

        <div className="text-xs font-mono tx-muted mt-4 text-right">
          {filtered.length} / {PHRASEBOOK.length} phrases
        </div>
      </div>
    </>
  );
}

export const Route = createFileRoute("/phrasebook")({
  component: PhrasebookRoute,
});
