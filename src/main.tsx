import { App as CapApp } from "@capacitor/app";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/index.css";

// Handle Android hardware back button — listen at app level
// Components push handlers via window event; here we just exit if nobody handled it
CapApp.addListener("backButton", ({ canGoBack }) => {
  const event = new CustomEvent<{ handled: boolean }>("appBackButton", {
    detail: { handled: false },
    cancelable: true,
  });
  window.dispatchEvent(event);

  // If no component handled it AND we can't go back, exit
  if (!event.defaultPrevented && !canGoBack) {
    CapApp.exitApp();
  }
}).catch(() => {
  // Not running in Capacitor (browser/PWA) — ignore
});

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
