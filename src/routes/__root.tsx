import { Header } from "@/components/Header";
import { TabBar } from "@/components/TabBar";
import { useApp } from "@/store/useApp";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect } from "react";

function RootLayout() {
  const hydrate = useApp((s) => s.hydrate);
  const hydrated = useApp((s) => s.hydrated);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-app dot-pattern flex items-center justify-center">
        <div className="font-serif text-2xl tx-muted animate-pulse">Lädt…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app dot-pattern flex flex-col">
      <Header />
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      <TabBar />
      <TanStackRouterDevtools position="top-right" />
    </div>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
});
