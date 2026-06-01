import { createFileRoute } from "@tanstack/react-router";

function DictionaryRoute() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="text-xs font-mono uppercase tracking-[0.3em] tx-muted mb-2">Wörterbuch</div>
      <h1 className="font-serif text-4xl font-black tx-text mb-8">Dictionary</h1>
      <div className="tx-muted font-mono">Coming soon.</div>
    </div>
  );
}

export const Route = createFileRoute("/dictionary")({
  component: DictionaryRoute,
});
