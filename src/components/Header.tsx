import { haptics } from "@/lib/haptics";
import { useNavigate } from "@tanstack/react-router";

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="border-b-4 bd-default bg-header">
      <div className="max-w-4xl mx-auto px-4 py-5">
        <button
          type="button"
          onClick={() => {
            haptics.tap();
            navigate({ to: "/lessons" });
          }}
          className="flex items-center gap-3 group"
        >
          <div className="spin-on-hover w-10 h-10 flex items-center justify-center font-black text-xl rounded-sm bg-btn tx-btn">
            D
          </div>
          <div className="text-left">
            <div className="font-serif text-2xl font-black tracking-tight tx-text">
              Deutsch Schule
            </div>
            <div className="text-xs -mt-1 tx-muted">Tirol-Edition</div>
          </div>
        </button>
      </div>
    </header>
  );
}
