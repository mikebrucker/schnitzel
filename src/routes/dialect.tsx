import { TYROLEAN } from "@/lib/curriculum";
import { haptics } from "@/lib/haptics";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

function DialectRoute() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <button
        type="button"
        onClick={() => {
          haptics.tap();
          navigate({ to: "/" });
        }}
        className="text-sm font-mono tx-muted mb-6"
      >
        ← Back
      </button>

      <div className="text-xs font-mono uppercase tracking-[0.3em] tx-muted mb-2">Bonus Modul</div>
      <h1 className="font-serif text-4xl font-black tx-text mb-2">Tirolerisch</h1>
      <p className="tx-body mb-8 leading-relaxed">
        What locals actually say. Learn standard German first — this is the cherry on top. Even
        Germans from the north don't understand Tyrolean.
      </p>

      <div className="border-2 bd-default bg-surface">
        <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 p-3 border-b-2 bd-default bg-accent-bg tx-text text-xs font-mono uppercase tracking-wider">
          <div>Tirolean</div>
          <div>Standard German</div>
          <div>English</div>
        </div>
        {TYROLEAN.map((row) => (
          <div
            key={row.tirol}
            className="grid grid-cols-[1fr_1fr_1fr] gap-2 p-3 border-b bd-default last:border-0 items-center"
          >
            <div className="font-serif font-bold tx-accent">{row.tirol}</div>
            <div className="tx-body text-sm">{row.standard}</div>
            <div className="tx-muted text-sm">{row.en}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-l-4 bd-accent bg-accent-bg p-5 tx-body leading-relaxed">
        <div className="font-bold mb-1 tx-text">Pro tip from a Tyrolean:</div>
        Walk into any Hütte after a ski day. Say "
        <span className="font-serif font-bold tx-text">Griaß di! A Marend, bitte.</span>" You'll get
        a respectful nod and probably a free Schnaps.
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dialect")({
  component: DialectRoute,
});
