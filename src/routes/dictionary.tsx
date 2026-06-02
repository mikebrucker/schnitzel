import { Chip } from "@/components/Chip";
import { Header } from "@/components/Header";
import { Card } from "@/components/card";
import { ChevronDownIcon, ChevronRightIcon } from "@/components/icons";
import { DICTIONARY, getConjugation } from "@/lib/curriculum";
import type { ConjugationEntry, LanguageProficiencyLevel } from "@/lib/types";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

const SORTED = [...DICTIONARY].sort((a, b) => a.lemma.localeCompare(b.lemma, "de"));

const LEVELS: Array<LanguageProficiencyLevel | "all"> = ["all", "A1", "A2"];

const PRONOUN_LABELS: Array<{ key: keyof ConjugationEntry["tenses"]["present"]; label: string }> = [
  { key: "ich", label: "ich" },
  { key: "du", label: "du" },
  { key: "er_sie_es", label: "er/sie/es" },
  { key: "wir", label: "wir" },
  { key: "ihr", label: "ihr" },
  { key: "sie_Sie", label: "sie/Sie" },
];

function ConjugationTable({ conj }: { conj: ConjugationEntry }) {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-mono uppercase tracking-wider tx-muted">Präsens</span>
        {conj.irregular ? <Chip label="unregelmäßig" /> : <Chip label="regelmäßig" />}
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-0.5 text-xs font-mono mb-3">
        {PRONOUN_LABELS.map(({ key, label }) => (
          <div key={key} className="flex gap-2">
            <span className="tx-muted w-14 shrink-0">{label}</span>
            <span className="tx-text font-bold">{conj.tenses.present[key]}</span>
          </div>
        ))}
      </div>
      <div className="text-xs font-mono">
        <span className="tx-muted">Perfekt: </span>
        <span className="tx-text">{conj.auxiliary} + </span>
        <span className="tx-accent font-bold">{conj.tenses.perfect.participle}</span>
        <span className="tx-muted"> — {conj.tenses.perfect.example}</span>
      </div>
    </div>
  );
}

function DictionaryRoute() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<LanguageProficiencyLevel | "all">("all");
  const [expandedConj, setExpandedConj] = useState<Set<string>>(new Set());

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

  const toggleConj = (id: string) => {
    setExpandedConj((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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
          <div className="space-y-2">
            {filtered.map((w) => {
              const conj = w.conjugationId ? getConjugation(w.conjugationId) : undefined;
              const conjOpen = expandedConj.has(w.id);
              return (
                <Card key={w.id} padding="sm" className="!p-0 rounded-none">
                  {conj ? (
                    <button
                      type="button"
                      onClick={() => toggleConj(w.id)}
                      className="w-full p-4 grid grid-cols-[1fr_1fr_auto] gap-4 items-start text-left"
                    >
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
                      <ChevronDownIcon
                        className={`tx-muted shrink-0 mt-1 transition-transform ${conjOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  ) : (
                    <div className="p-4 grid grid-cols-[1fr_1fr] gap-4 items-start">
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
                  )}
                  {conj ? (
                    <div
                      className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                      style={{ gridTemplateRows: conjOpen ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <div className="border-t-2 bd-default">
                          <ConjugationTable conj={conj} />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </Card>
              );
            })}
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
