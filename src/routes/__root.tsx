import { TabBar } from "@/components/TabBar";
import { useApp } from "@/store/useApp";
import { SplashScreen } from "@capacitor/splash-screen";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Suspense, lazy, useEffect } from "react";

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null
  : lazy(() =>
      import("@tanstack/react-router-devtools").then((m) => ({
        default: m.TanStackRouterDevtools,
      })),
    );

function RootLayout() {
  const hydrate = useApp((s) => s.hydrate);
  const hydrated = useApp((s) => s.hydrated);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (hydrated) {
      SplashScreen.hide({ fadeOutDuration: 200 }).catch(() => {});
    }
  }, [hydrated]);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-app dot-pattern flex items-center justify-center">
        <div className="font-serif text-2xl tx-muted animate-pulse">Lädt…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app dot-pattern flex flex-col">
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      <TabBar />
      <Suspense>
        <TanStackRouterDevtools position="top-right" />
      </Suspense>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
});
