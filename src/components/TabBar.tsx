import { haptics } from "@/lib/haptics";
import { TAB_ROOTS, useApp } from "@/store/useApp";
import type { TabRoot } from "@/store/useApp";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

type TabDef = {
  root: TabRoot;
  label: string;
  Icon: React.ComponentType;
};

const TABS: Array<TabDef> = [
  { root: "/lessons", label: "Lessons", Icon: BookIcon },
  { root: "/dictionary", label: "Dictionary", Icon: SearchIcon },
  { root: "/phrasebook", label: "Phrasebook", Icon: BubbleIcon },
  { root: "/hobbies", label: "Hobbies", Icon: StarIcon },
  { root: "/profile", label: "Profile", Icon: PersonIcon },
];

function activeRoot(pathname: string): TabRoot {
  return (TAB_ROOTS.find((r) => pathname.startsWith(r)) as TabRoot | undefined) ?? "/lessons";
}

export function TabBar() {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const tabPaths = useApp((s) => s.tabPaths);
  const setTabPath = useApp((s) => s.setTabPath);

  const current = activeRoot(pathname);

  useEffect(() => {
    setTabPath(current, pathname);
  }, [pathname, current, setTabPath]);

  const handlePress = (tab: TabDef) => {
    haptics.tap();
    if (tab.root === current) {
      if (pathname !== tab.root && pathname !== `${tab.root}/`) {
        void router.navigate({ href: tab.root });
      }
    } else {
      void router.navigate({ href: tabPaths[tab.root] });
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-header border-t-2 bd-default z-50">
      <div className="max-w-4xl mx-auto flex">
        {TABS.map((tab) => {
          const active = tab.root === current;
          return (
            <button
              key={tab.root}
              type="button"
              onClick={() => handlePress(tab)}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-1 transition-colors ${active ? "bg-accent-bg tx-accent" : " tx-muted"}`}
            >
              <tab.Icon />
              <span className="text-[10px] font-mono uppercase tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function BookIcon() {
  return (
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
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function SearchIcon() {
  return (
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
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function BubbleIcon() {
  return (
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
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function StarIcon() {
  return (
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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function PersonIcon() {
  return (
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
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
