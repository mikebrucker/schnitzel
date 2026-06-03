import { BottomSheet } from "@/components/BottomSheet";
import { Chip } from "@/components/Chip";
import { Header } from "@/components/Header";
import { Modal } from "@/components/Modal";
import { Card } from "@/components/card";
import { GridIcon, ListIcon } from "@/components/icons";
import { DICTIONARY, getConjugation } from "@/lib/curriculum";
import type { ConjugationEntry, DictionaryEntry, LanguageProficiencyLevel } from "@/lib/types";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

type ViewMode = "list" | "grid";

const SORTED = [...DICTIONARY].sort((a, b) => a.lemma.localeCompare(b.lemma, "de"));

const LEVELS: Array<LanguageProficiencyLevel | "all"> = ["all", "A1", "A2"];

const POS_VALUES = ["all", "adjective", "adverb", "noun", "numeral", "phrase", "verb"] as const;
type PosFilter = (typeof POS_VALUES)[number];

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
    <div className="p-4 border-t-2 bd-default">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-mono uppercase tracking-wider tx-muted">Präsens</span>
        {conj.irregular ? <Chip label="unregelmäßig" /> : <Chip label="regelmäßig" />}
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs font-mono mb-3">
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

function WordDetail({ w, conj }: { w: DictionaryEntry; conj: ConjugationEntry | undefined }) {
  return (
    <div className="px-5 pt-2 pb-8">
      <div className="flex items-start gap-3 mb-1 flex-wrap">
        <span className="font-serif text-3xl font-bold tx-text leading-tight">{w.de}</span>
        {w.gender !== null ? <Chip label={w.gender} /> : null}
        {w.loanword ? <Chip label="loanword" /> : null}
      </div>
      {w.ipa !== null ? <div className="text-xs font-mono tx-muted mb-3">[{w.ipa}]</div> : null}

      <div className="tx-body text-xl mb-5">{w.en}</div>

      <div className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-sm font-mono mb-4">
        <span className="tx-muted">Part of speech</span>
        <span className="tx-text">{w.partOfSpeech}</span>
        <span className="tx-muted">Level</span>
        <span className="tx-accent font-bold">{w.level}</span>
        {w.plural !== null ? (
          <>
            <span className="tx-muted">Plural</span>
            <span className="tx-text font-bold">{w.plural}</span>
          </>
        ) : null}
        {w.lemma !== w.de ? (
          <>
            <span className="tx-muted">Lemma</span>
            <span className="tx-text">{w.lemma}</span>
          </>
        ) : null}
      </div>

      {w.tags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {w.tags.map((tag) => (
            <Chip key={tag} label={tag} />
          ))}
        </div>
      ) : null}

      {w.note !== null ? (
        <div className="pt-4 mt-4 border-t bd-default text-sm font-mono tx-muted italic leading-relaxed">
          {w.note}
        </div>
      ) : null}

      {w.exampleSentence !== null ? (
        <div className="pt-4 mt-4 border-t bd-default space-y-1">
          <div className="text-xs font-mono uppercase tracking-wider tx-muted mb-2">Beispiel</div>
          <div className="tx-text font-mono text-sm">{w.exampleSentence.de}</div>
          <div className="tx-muted font-mono text-xs">{w.exampleSentence.en}</div>
        </div>
      ) : null}

      {conj ? <ConjugationTable conj={conj} /> : null}
    </div>
  );
}

function WordCard({ w, view }: { w: DictionaryEntry; view: ViewMode }) {
  const [open, setOpen] = useState(false);
  const conj = w.conjugationId ? getConjugation(w.conjugationId) : undefined;

  return (
    <>
      <Card padding="sm" className="!p-0 rounded-none">
        <button type="button" onClick={() => setOpen(true)} className="w-full text-left">
          {view === "list" ? (
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
          ) : (
            <div className="p-3">
              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                <span className="font-serif text-base font-bold tx-text">{w.de}</span>
                {w.gender !== null ? <Chip label={w.gender} /> : null}
              </div>
              <div className="tx-body text-sm">{w.en}</div>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <span className="text-xs font-mono tx-muted">{w.partOfSpeech}</span>
                <span className="text-xs font-mono tx-accent border bd-accent px-1">{w.level}</span>
              </div>
            </div>
          )}
          {conj && view === "list" ? <ConjugationTable conj={conj} /> : null}
        </button>
      </Card>
      <BottomSheet open={open} onClose={() => setOpen(false)}>
        <WordDetail w={w} conj={conj} />
      </BottomSheet>
    </>
  );
}

function DictionaryRoute() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<LanguageProficiencyLevel | "all">("all");
  const [pos, setPos] = useState<PosFilter>("all");
  const [view, setView] = useState<ViewMode>("list");
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SORTED.filter((w) => {
      if (level !== "all" && w.level !== level) return false;
      if (pos !== "all" && w.partOfSpeech !== pos) return false;
      if (!q) return true;
      return (
        w.de.toLowerCase().includes(q) ||
        w.lemma.toLowerCase().includes(q) ||
        w.en.toLowerCase().includes(q)
      );
    });
  }, [query, level, pos]);

  return (
    <>
      <Header
        title="Wörterbuch"
        subtitle="Dictionary"
        primaryAction={{
          label: "View",
          icon: view === "list" ? ListIcon : GridIcon,
          onClick: () => setViewModalOpen(true),
        }}
      />

      <Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)}>
        <div className="text-xs font-mono uppercase tracking-wider tx-muted mb-3">View</div>
        <div className="grid grid-cols-2 gap-4">
          {(["list", "grid"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => {
                setView(v);
                setViewModalOpen(false);
              }}
              className={`flex flex-col items-center gap-3 p-6 border-2 rounded-xl transition-colors ${
                view === v ? "bd-accent bg-accent-bg tx-accent" : "bd-default tx-muted"
              }`}
            >
              {v === "list" ? <ListIcon size={36} /> : <GridIcon size={36} />}
              <span className="text-base font-mono capitalize">{v}</span>
            </button>
          ))}
        </div>
      </Modal>

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

        <div className="flex gap-2 mb-3 flex-wrap">
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
        <div className="flex gap-2 mb-6 flex-wrap">
          {POS_VALUES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPos(p)}
              className={`px-3 py-1 text-xs font-mono border-2 transition-colors ${
                pos === p ? "bd-accent bg-accent-bg tx-accent" : "bd-default bg-surface tx-muted"
              }`}
            >
              {p === "all" ? "All" : p}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="tx-muted font-mono text-sm py-8 text-center">Nichts gefunden.</div>
        ) : (
          <div className={view === "grid" ? "grid grid-cols-2 gap-2" : "space-y-2"}>
            {filtered.map((w) => (
              <WordCard key={w.id} w={w} view={view} />
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
