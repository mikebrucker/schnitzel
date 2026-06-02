import { applyStatusBarTheme } from "@/lib/statusBar";
import type { Lesson, Profile, QuizMode, Theme } from "@/lib/types";
import { storage } from "@/storage/storage";
import { create } from "zustand";

const TAB_ROOTS = ["/lessons", "/dictionary", "/phrasebook", "/hobbies", "/profile"] as const;
type TabRoot = (typeof TAB_ROOTS)[number];

function parseTabOrder(raw: Array<string> | null): Array<TabRoot> {
  if (!raw) return [...TAB_ROOTS];
  const valid = raw.filter((r): r is TabRoot => (TAB_ROOTS as ReadonlyArray<string>).includes(r));
  const missing = TAB_ROOTS.filter((r) => !valid.includes(r));
  return [...valid, ...missing];
}

type AppState = {
  // URL-mirrored state (set by route components)
  activeLesson: Lesson | null;
  quizMode: QuizMode;

  // Per-tab navigation memory (in-memory only, not persisted)
  tabPaths: Record<TabRoot, string>;

  // Persisted state
  theme: Theme;
  defaultTab: string;
  tabOrder: Array<TabRoot>;
  completed: Set<number>;
  profile: Profile;

  // Bootstrap
  hydrated: boolean;

  // Actions
  setActiveLesson: (lesson: Lesson | null) => void;
  setQuizMode: (mode: QuizMode) => void;
  setTabPath: (root: TabRoot, path: string) => void;
  setTheme: (theme: Theme) => void;
  setDefaultTab: (tab: string) => void;
  setTabOrder: (order: Array<TabRoot>) => void;
  markLessonComplete: (id: number) => void;
  unmarkLessonComplete: (id: number) => void;
  setProfile: (profile: Profile) => void;
  resetAllProgress: () => Promise<void>;
  hydrate: () => Promise<void>;
};

const DEFAULT_PROFILE: Profile = {
  name: "Bruck",
  location: "Tirol, Austria",
  level: "A1",
};

const DEFAULT_TAB_PATHS: Record<TabRoot, string> = {
  "/lessons": "/lessons",
  "/dictionary": "/dictionary",
  "/phrasebook": "/phrasebook",
  "/hobbies": "/hobbies",
  "/profile": "/profile",
};

export { TAB_ROOTS };
export type { TabRoot };

export const useApp = create<AppState>((set, get) => ({
  activeLesson: null,
  quizMode: "normal",
  tabPaths: { ...DEFAULT_TAB_PATHS },
  theme: "dark",
  defaultTab: "/lessons",
  tabOrder: [...TAB_ROOTS],
  completed: new Set<number>(),
  profile: DEFAULT_PROFILE,
  hydrated: false,

  setActiveLesson: (activeLesson) => set({ activeLesson }),
  setQuizMode: (quizMode) => set({ quizMode }),
  setTabPath: (root, path) => set((s) => ({ tabPaths: { ...s.tabPaths, [root]: path } })),

  setDefaultTab: (tab) => {
    set({ defaultTab: tab });
    storage.set("default-tab", tab);
  },

  setTabOrder: (order) => {
    set({ tabOrder: order });
    storage.setJSON("tab-order", order);
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
    const [themeRaw, completedRaw, profileRaw, defaultTabRaw, tabOrderRaw] = await Promise.all([
      storage.get("theme"),
      storage.getJSON<Array<number>>("completed-lessons"),
      storage.getJSON<Profile>("profile"),
      storage.get("default-tab"),
      storage.getJSON<Array<string>>("tab-order"),
    ]);

    const theme: Theme = themeRaw === "light" || themeRaw === "dark" ? themeRaw : "dark";

    set({
      theme,
      defaultTab: defaultTabRaw ?? "/lessons",
      tabOrder: parseTabOrder(tabOrderRaw),
      completed: new Set(completedRaw ?? []),
      profile: profileRaw ?? DEFAULT_PROFILE,
      hydrated: true,
    });

    document.documentElement.setAttribute("data-theme", theme);
    applyStatusBarTheme(theme);
  },
}));
