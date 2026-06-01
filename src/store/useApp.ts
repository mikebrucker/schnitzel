import { applyStatusBarTheme } from "@/lib/statusBar";
import { storage } from "@/lib/storage";
import type { Lesson, Profile, QuizMode, Theme } from "@/lib/types";
import { create } from "zustand";

type AppState = {
  // URL-mirrored state (set by route components)
  activeLesson: Lesson | null;
  quizMode: QuizMode;

  // Persisted state
  theme: Theme;
  defaultTab: string;
  completed: Set<number>;
  profile: Profile;

  // Bootstrap
  hydrated: boolean;

  // Actions
  setActiveLesson: (lesson: Lesson | null) => void;
  setQuizMode: (mode: QuizMode) => void;
  setTheme: (theme: Theme) => void;
  setDefaultTab: (tab: string) => void;
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
  activeLesson: null,
  quizMode: "normal",
  theme: "dark",
  defaultTab: "/lessons",
  completed: new Set<number>(),
  profile: DEFAULT_PROFILE,
  hydrated: false,

  setActiveLesson: (activeLesson) => set({ activeLesson }),
  setQuizMode: (quizMode) => set({ quizMode }),

  setDefaultTab: (tab) => {
    set({ defaultTab: tab });
    storage.set("default-tab", tab);
  },

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
    const [themeRaw, completedRaw, profileRaw, defaultTabRaw] = await Promise.all([
      storage.get("theme"),
      storage.getJSON<Array<number>>("completed-lessons"),
      storage.getJSON<Profile>("profile"),
      storage.get("default-tab"),
    ]);

    const theme: Theme = themeRaw === "light" || themeRaw === "dark" ? themeRaw : "dark";

    set({
      theme,
      defaultTab: defaultTabRaw ?? "/lessons",
      completed: new Set(completedRaw ?? []),
      profile: profileRaw ?? DEFAULT_PROFILE,
      hydrated: true,
    });

    document.documentElement.setAttribute("data-theme", theme);
    applyStatusBarTheme(theme);
  },
}));
