import { useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { haptics } from "@/lib/haptics";
import type { TabDef } from "@/lib/tabs";
import { TABS } from "@/lib/tabs";
import type { TabRoot } from "@/store/useApp";
import { TAB_ROOTS, useApp } from "@/store/useApp";

function activeRoot(pathname: string): TabRoot {
  return (TAB_ROOTS.find((r) => pathname.startsWith(r)) as TabRoot | undefined) ?? "/lessons";
}

export function TabBar() {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const tabPaths = useApp((s) => s.tabPaths);
  const setTabPath = useApp((s) => s.setTabPath);
  const tabOrder = useApp((s) => s.tabOrder);

  const current = activeRoot(pathname);

  useEffect(() => {
    setTabPath(current, pathname);
  }, [pathname, current, setTabPath]);

  const orderedTabs = tabOrder
    .map((root) => TABS.find((t) => t.root === root))
    .filter((t): t is TabDef => t !== undefined);

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
    <nav
      className="fixed bottom-0 left-0 right-0 bg-header border-t-2 bd-default z-50"
      style={{ paddingBottom: "var(--safe-bottom)" }}
    >
      <div className="max-w-4xl mx-auto flex md:px-4">
        {orderedTabs.map((tab) => {
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
