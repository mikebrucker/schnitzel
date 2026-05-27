import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

// Unified key-value storage. JSON-string in, JSON-string out.
// On native: Capacitor Preferences (persists across app updates).
// On web: localStorage (works in PWA).
const isNative = Capacitor.isNativePlatform();

export const storage = {
  async get(key: string): Promise<string | null> {
    if (isNative) {
      const { value } = await Preferences.get({ key });
      return value;
    }
    return localStorage.getItem(key);
  },

  async set(key: string, value: string): Promise<void> {
    if (isNative) {
      await Preferences.set({ key, value });
      return;
    }
    localStorage.setItem(key, value);
  },

  async remove(key: string): Promise<void> {
    if (isNative) {
      await Preferences.remove({ key });
      return;
    }
    localStorage.removeItem(key);
  },

  async keys(): Promise<Array<string>> {
    if (isNative) {
      const { keys } = await Preferences.keys();
      return keys;
    }
    return Object.keys(localStorage);
  },

  async getJSON<T>(key: string): Promise<T | null> {
    const raw = await this.get(key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  async setJSON<T>(key: string, value: T): Promise<void> {
    await this.set(key, JSON.stringify(value));
  },
};
