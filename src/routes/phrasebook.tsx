import { Header } from "@/components/Header";
import { createFileRoute } from "@tanstack/react-router";

function PhrasebookRoute() {
  return (
    <>
      <Header title="Phrasebuch" subtitle="Phrasebook" />
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="tx-muted font-mono">Coming soon.</div>
      </div>
    </>
  );
}

export const Route = createFileRoute("/phrasebook")({
  component: PhrasebookRoute,
});
