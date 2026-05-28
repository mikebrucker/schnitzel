import { App as CapApp } from "@capacitor/app";
import { RouterProvider, createHashHistory, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { routeTree } from "./routeTree.gen";
import "./styles/index.css";

const router = createRouter({
  routeTree,
  history: createHashHistory(),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

CapApp.addListener("backButton", ({ canGoBack }) => {
  const event = new CustomEvent("appBackButton", { cancelable: true });
  window.dispatchEvent(event);
  if (event.defaultPrevented) return;
  if (canGoBack || window.history.length > 1) {
    window.history.back();
  } else {
    CapApp.exitApp();
  }
}).catch(() => {
  // Not running in Capacitor (browser/PWA) — ignore
});

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
