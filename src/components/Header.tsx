import { haptics } from "@/lib/haptics";
import { useApp } from "@/store/useApp";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type Path = "/" | "/profile" | "/settings";

export function Header() {
  const navigate = useNavigate();
  const theme = useApp((s) => s.theme);
  const setTheme = useApp((s) => s.setTheme);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: Event) => {
      e.preventDefault();
      setOpen(false);
    };
    window.addEventListener("appBackButton", handler);
    return () => window.removeEventListener("appBackButton", handler);
  }, [open]);

  const goto = (to: Path) => {
    setOpen(false);
    haptics.tap();
    navigate({ to });
  };

  return (
    <>
      <header className="border-b-4 bd-default bg-header">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <button type="button" onClick={() => goto("/")} className="flex items-center gap-3 group">
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

          <button
            type="button"
            onClick={() => {
              setOpen(true);
              haptics.tap();
            }}
            aria-label="Open menu"
            className="w-10 h-10 flex items-center justify-center border-2 bd-default tx-text"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      <div
        onClick={() => setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setOpen(false);
        }}
        role="button"
        tabIndex={-1}
        aria-hidden="true"
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: "rgba(0,0,0,0.5)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />

      <aside
        className="fixed top-0 right-0 h-full z-50 border-l-4 bd-default bg-header transition-transform duration-300 ease-out flex flex-col"
        style={{
          width: "80%",
          maxWidth: "420px",
          transform: open ? "translateX(0)" : "translateX(100%)",
          boxShadow: open ? "-8px 0 24px rgba(0,0,0,0.3)" : "none",
        }}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b-2 bd-default">
          <div className="font-serif text-xl font-black tx-text">Menü</div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="w-10 h-10 flex items-center justify-center border-2 bd-default tx-text"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <MenuItem
            label="Home"
            sub="All lessons"
            onClick={() => goto("/")}
            icon={
              <>
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </>
            }
          />

          <MenuItem
            label="Profile"
            sub="Stats & settings"
            onClick={() => goto("/profile")}
            icon={
              <>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </>
            }
          />

          <button
            type="button"
            onClick={() => {
              setTheme(theme === "dark" ? "light" : "dark");
              haptics.tap();
            }}
            className="w-full flex items-center justify-between px-6 py-5 border-b-2 bd-default hover:opacity-80 transition-opacity tx-text"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{theme === "dark" ? "☾" : "☀"}</span>
              <div className="text-left">
                <div className="font-serif font-bold">
                  {theme === "dark" ? "Dark mode" : "Light mode"}
                </div>
                <div className="text-xs font-mono tx-muted">Tap to switch</div>
              </div>
            </div>
            <span
              className="relative inline-block rounded-full transition-colors"
              style={{
                background: theme === "dark" ? "#10b981" : "#57534e",
                width: "44px",
                height: "24px",
              }}
            >
              <span
                className="absolute rounded-full transition-all"
                style={{
                  background: "#ffffff",
                  width: "18px",
                  height: "18px",
                  top: "3px",
                  left: theme === "dark" ? "23px" : "3px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
                }}
              />
            </span>
          </button>

          <MenuItem
            label="Settings"
            sub="Progress, resets, more"
            onClick={() => goto("/settings")}
            icon={
              <>
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </>
            }
          />
        </div>

        <div className="px-6 py-4 text-xs font-mono text-center tx-muted border-t-2 bd-default">
          Bruck · Tirol · 2026
        </div>
      </aside>
    </>
  );
}

function MenuItem({
  label,
  sub,
  icon,
  onClick,
}: {
  label: string;
  sub: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-6 py-5 text-left hover:opacity-80 transition-opacity border-b-2 bd-default tx-text"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {icon}
      </svg>
      <div>
        <div className="font-serif font-bold">{label}</div>
        <div className="text-xs font-mono tx-muted">{sub}</div>
      </div>
    </button>
  );
}
