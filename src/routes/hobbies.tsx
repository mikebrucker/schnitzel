import { Header } from "@/components/Header";
import { createFileRoute } from "@tanstack/react-router";

function HobbiesRoute() {
  return (
    <>
      <Header title="Hobbies" />
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="tx-muted font-mono">Coming soon.</div>
      </div>
    </>
  );
}

export const Route = createFileRoute("/hobbies")({
  component: HobbiesRoute,
});
