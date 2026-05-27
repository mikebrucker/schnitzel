import { applyStatusBarTheme } from "@/lib/statusBar";
import { storage } from "@/lib/storage";
import type { Lesson, Profile, QuizMode, Theme, View } from "@/lib/types";
import { create } from "zustand";

type AppState = {
  // UI state
  view: View;
  activeLesson: Lesson | null;
  quizMode: QuizMode;

  // Persisted state
  theme: Theme;
  completed: Set<number>;
  profile: Profile;

  // Bootstrap
  hydrated: boolean;

  // Actions
  setView: (view: View) => void;
  setActiveLesson: (lesson: Lesson | null) => void;
  setQuizMode: (mode: QuizMode) => void;
  setTheme: (theme: Theme) => void;
  markLessonComplete: (id: number) => void;
  unmarkLessonComplete: (id: number) => void;
  setProfile: (profile: Profile) => void;
  resetAllProgress: () => Promise<void>;
  hydrate: () => Promise<void>;
};

const DEFAULT_PROFILE: Profile = {
  name: "Bruck",
  location: "Tirol, Austria",
  level: "A1 — Beginner",
};

export const useApp = create<AppState>((set, get) => ({
  view: "home",
  activeLesson: null,
  quizMode: "normal",
  theme: "dark",
  completed: new Set<number>(),
  profile: DEFAULT_PROFILE,
  hydrated: false,

  setView: (view) => set({ view }),
  setActiveLesson: (activeLesson) => set({ activeLesson }),
  setQuizMode: (quizMode) => set({ quizMode }),

  setTheme: (theme) => {
    set({ theme });
    document.documentElement.setAttribute("data-theme", theme);
    storage.set("theme", theme);
    applyStatusBarTheme(theme);
  },

  markLessonComplete: (id) => {
    const next = new Set(get().completed);
    next.add(id);
    set({ completed: next });
    storage.setJSON("completed-lessons", [...next]);
  },

  unmarkLessonComplete: (id) => {
    const next = new Set(get().completed);
    next.delete(id);
    set({ completed: next });
    storage.setJSON("completed-lessons", [...next]);
  },

  setProfile: (profile) => {
    set({ profile });
    storage.setJSON("profile", profile);
  },

  resetAllProgress: async () => {
    set({ completed: new Set<number>() });
    const allKeys = await storage.keys();
    await Promise.all(
      allKeys.filter((k) => k.startsWith("quiz-progress:")).map((k) => storage.remove(k)),
    );
    await storage.remove("completed-lessons");
  },

  hydrate: async () => {
    const [themeRaw, completedRaw, profileRaw] = await Promise.all([
      storage.get("theme"),
      storage.getJSON<Array<number>>("completed-lessons"),
      storage.getJSON<Profile>("profile"),
    ]);

    const theme: Theme = themeRaw === "light" || themeRaw === "dark" ? themeRaw : "dark";

    set({
      theme,
      completed: new Set(completedRaw ?? []),
      profile: profileRaw ?? DEFAULT_PROFILE,
      hydrated: true,
    });

    document.documentElement.setAttribute("data-theme", theme);
    applyStatusBarTheme(theme);
  },
}));
