import { haptics } from "@/lib/haptics";
import { loadQuizProgress } from "@/lib/quizStorage";
import type { QuizMode } from "@/lib/types";
import { useApp } from "@/store/useApp";
import { createFileRoute, useLoaderData, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type QuizState = "none" | "progress" | "done";

function LessonRoute() {
  const { lesson } = useLoaderData({ from: "/lessons/$id" });
  const navigate = useNavigate();
  const setActiveLesson = useApp((s) => s.setActiveLesson);
  const setQuizMode = useApp((s) => s.setQuizMode);

  useEffect(() => {
    setActiveLesson(lesson);
  }, [lesson, setActiveLesson]);

  const [quizState, setQuizState] = useState<QuizState>("none");
  const [savedScore, setSavedScore] = useState<{ score: number; total: number } | null>(null);
  const [inProgressCount, setInProgressCount] = useState<{
    answered: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      haptics.tap();
      navigate({ to: "/" });
    };
    window.addEventListener("appBackButton", handler);
    return () => window.removeEventListener("appBackButton", handler);
  }, [navigate]);

  useEffect(() => {
    let cancelled = false;
    loadQuizProgress(lesson.id).then((saved) => {
      if (cancelled || !saved) return;
      const total = saved.questions.length;
      const done = saved.idx >= total;
      setQuizState(done ? "done" : "progress");
      if (done) {
        setSavedScore({ score: saved.score, total });
      } else {
        setInProgressCount({ answered: saved.answers.length, total });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [lesson.id]);

  const startQuiz = (mode: QuizMode) => {
    setQuizMode(mode);
    haptics.tap();
    navigate({
      to: "/lessons/$id/quiz",
      params: { id: String(lesson.id) },
      search: { mode },
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <button
        type="button"
        onClick={() => {
          haptics.tap();
          navigate({ to: "/" });
        }}
        className="text-sm font-mono tx-muted mb-6"
      >
        ← Back to lessons
      </button>

      <div className="text-xs font-mono uppercase tracking-[0.3em] tx-muted mb-2">
        {lesson.level} · Unit {lesson.unit} · Lesson {lesson.lessonNum}
      </div>
      <h1 className="font-serif text-4xl font-black tx-text mb-1">{lesson.title}</h1>
      <div className="tx-muted text-lg mb-8">{lesson.titleDe}</div>

      <section className="mb-10">
        <h2 className="font-serif text-2xl font-bold tx-text mb-4 border-b-2 bd-default pb-1">
          Vokabular
        </h2>
        <div className="border-2 bd-default bg-surface divide-y-2">
          {lesson.vocab.map((v) => (
            <div
              key={v.de}
              className="p-4 grid grid-cols-[1fr_1fr] gap-4 items-start border-b last:border-0 bd-default"
            >
              <div className="font-serif text-lg font-bold tx-text">{v.de}</div>
              <div>
                <div className="tx-body">{v.en}</div>
                {v.note && <div className="text-xs tx-accent mt-1">💡 {v.note}</div>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-serif text-2xl font-bold tx-text mb-4 border-b-2 bd-default pb-1">
          Grammatik
        </h2>
        <div className="border-l-4 bd-accent bg-accent-bg p-5 tx-body leading-relaxed">
          {lesson.grammar}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-serif text-2xl font-bold tx-text mb-4 border-b-2 bd-default pb-1">
          Beispiel
        </h2>
        <div className="border-2 bd-default p-5 bg-surface-solid">
          <div className="font-serif text-xl tx-text mb-2">"{lesson.example.de}"</div>
          <div className="tx-muted">{lesson.example.en}</div>
        </div>
      </section>

      {quizState !== "none" && (
        <div className="border-2 bd-default bg-surface p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider tx-muted">Quiz</span>
            {quizState === "done" && savedScore ? (
              <span className="font-mono font-bold tx-accent">
                {savedScore.score}/{savedScore.total} ·{" "}
                {Math.round((savedScore.score / savedScore.total) * 100)}%
              </span>
            ) : inProgressCount ? (
              <span className="font-mono text-xs tx-muted">
                {inProgressCount.answered}/{inProgressCount.total} answered
              </span>
            ) : null}
          </div>
          <div className="w-full h-1.5 bg-surface-solid">
            {quizState === "done" && savedScore && (
              <div
                className="h-full"
                style={{
                  width: `${Math.round((savedScore.score / savedScore.total) * 100)}%`,
                  backgroundColor: "var(--accent-border)",
                }}
              />
            )}
            {quizState === "progress" && inProgressCount && (
              <div
                className="h-full opacity-40"
                style={{
                  width: `${Math.round((inProgressCount.answered / inProgressCount.total) * 100)}%`,
                  backgroundColor: "var(--accent-border)",
                }}
              />
            )}
          </div>
        </div>
      )}

      {quizState === "done" ? (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => startQuiz("view")}
            className="w-full bg-btn tx-btn py-4 font-serif text-xl font-bold border-2 bd-btn"
          >
            View Results →
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => startQuiz("retake")}
              className="border-2 bd-default bg-surface tx-text py-3 font-bold"
            >
              ↻ Retake quiz
            </button>
            <button
              type="button"
              onClick={() => startQuiz("wrong")}
              disabled={!savedScore || savedScore.score === savedScore.total}
              className="border-2 bd-default bg-surface tx-text py-3 font-bold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ✗ Retry wrong only
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => startQuiz("normal")}
          className="w-full bg-btn tx-btn py-4 font-serif text-xl font-bold border-2 bd-btn"
        >
          {quizState === "progress" ? "Resume Quiz →" : "Take Quiz →"}
        </button>
      )}
    </div>
  );
}

export const Route = createFileRoute("/lessons/$id/")({
  component: LessonRoute,
});
