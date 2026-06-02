import { Chip } from "@/components/Chip";
import { Header } from "@/components/Header";
import { DICTIONARY } from "@/lib/curriculum";
import type { LanguageProficiencyLevel } from "@/lib/types";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

const SORTED = [...DICTIONARY].sort((a, b) => a.lemma.localeCompare(b.lemma, "de"));

const LEVELS: Array<LanguageProficiencyLevel | "all"> = ["all", "A1", "A2"];

function DictionaryRoute() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<LanguageProficiencyLevel | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SORTED.filter((w) => {
      if (level !== "all" && w.level !== level) return false;
      if (!q) return true;
      return (
        w.de.toLowerCase().includes(q) ||
        w.lemma.toLowerCase().includes(q) ||
        w.en.toLowerCase().includes(q)
      );
    });
  }, [query, level]);

  return (
    <>
      <Header title="Wörterbuch" subtitle="Dictionary" />
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="mb-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search German or English…"
            className="w-full border-2 bd-default bg-surface tx-body px-4 py-3 font-mono text-sm outline-none focus:bd-accent"
          />
        </div>

        <div className="flex gap-2 mb-6">
          {LEVELS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLevel(l)}
              className={`px-3 py-1 text-xs font-mono border-2 transition-colors ${
                level === l ? "bd-accent bg-accent-bg tx-accent" : "bd-default bg-surface tx-muted"
              }`}
            >
              {l === "all" ? "All" : l}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="tx-muted font-mono text-sm py-8 text-center">Nichts gefunden.</div>
        ) : (
          <div className="border-2 bd-default bg-surface divide-y bd-default">
            {filtered.map((w) => (
              <div key={w.id} className="p-4 grid grid-cols-[1fr_1fr] gap-4 items-start">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-serif text-lg font-bold tx-text">{w.de}</span>
                  {w.gender !== null ? <Chip label={w.gender} /> : null}
                </div>
                <div>
                  <div className="tx-body">{w.en}</div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs font-mono tx-muted">{w.partOfSpeech}</span>
                    <span className="text-xs font-mono tx-accent border bd-accent px-1">
                      {w.level}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-xs font-mono tx-muted mt-4 text-right">
          {filtered.length} / {DICTIONARY.length} words
        </div>
      </div>
    </>
  );
}

export const Route = createFileRoute("/dictionary")({
  component: DictionaryRoute,
});
