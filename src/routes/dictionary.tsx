import { Header } from "@/components/Header";
import { createFileRoute } from "@tanstack/react-router";

function DictionaryRoute() {
  return (
    <>
      <Header title="Wörterbuch" subtitle="Dictionary" />
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="tx-muted font-mono">Coming soon.</div>
      </div>
    </>
  );
}

export const Route = createFileRoute("/dictionary")({
  component: DictionaryRoute,
});
