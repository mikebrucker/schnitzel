import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import type { Theme } from "./types";

const isNative = Capacitor.isNativePlatform();

export async function applyStatusBarTheme(theme: Theme): Promise<void> {
  if (!isNative) return;
  try {
    await StatusBar.setStyle({
      style: theme === "dark" ? Style.Dark : Style.Light,
    });
    if (Capacitor.getPlatform() === "android") {
      await StatusBar.setBackgroundColor({
        color: theme === "dark" ? "#0f1614" : "#fbf5e5",
      });
    }
  } catch {
    /* silent */
  }
}
