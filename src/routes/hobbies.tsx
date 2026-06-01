import { createFileRoute } from "@tanstack/react-router";

function HobbiesRoute() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <div className="text-xs font-mono uppercase tracking-[0.3em] tx-muted mb-2">Hobbies</div>
      <h1 className="font-serif text-4xl font-black tx-text mb-8">Hobbies</h1>
      <div className="tx-muted font-mono">Coming soon.</div>
    </div>
  );
}

export const Route = createFileRoute("/hobbies")({
  component: HobbiesRoute,
});
