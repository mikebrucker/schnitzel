import { DialectView } from "@/components/DialectView";
import { Header } from "@/components/Header";
import { Home } from "@/components/Home";
import { LessonView } from "@/components/LessonView";
import { ProfileView } from "@/components/ProfileView";
import { QuizView } from "@/components/QuizView";
import { SettingsView } from "@/components/SettingsView";
import { useApp } from "@/store/useApp";
import { useEffect } from "react";

export default function App() {
  const hydrate = useApp((s) => s.hydrate);
  const hydrated = useApp((s) => s.hydrated);
  const view = useApp((s) => s.view);
  const activeLesson = useApp((s) => s.activeLesson);
  const quizMode = useApp((s) => s.quizMode);

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

      <main className="flex-1">
        {view === "home" && <Home />}
        {view === "lesson" && activeLesson && <LessonView lesson={activeLesson} />}
        {view === "quiz" && activeLesson && (
          <QuizView key={`${activeLesson.id}-${quizMode}`} lesson={activeLesson} mode={quizMode} />
        )}
        {view === "dialect" && <DialectView />}
        {view === "profile" && <ProfileView />}
        {view === "settings" && <SettingsView />}
      </main>

      <footer className="border-t-2 bd-default py-6 text-center text-xs font-mono tx-muted">
        Made for Bruck · Tirol, AT · 2026
      </footer>
    </div>
  );
}
