import { createFileRoute, useLoaderData, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { Results } from "@/components/Results";
import { getHobbyQuiz } from "@/lib/curriculum";
import { haptics } from "@/lib/haptics";
import { getPrompt, isAnswerCorrect } from "@/lib/quizLogic";
import type { QuizMode, QuizQuestion } from "@/lib/types";
import { loadHobbyQuizProgress, saveHobbyQuizProgress } from "@/storage/quizStorage";

function validateQuizMode(m: unknown): QuizMode {
  return m === "view" || m === "retake" || m === "normal" ? m : "normal";
}

function HobbyQuizRoute() {
  const { hobby } = useLoaderData({ from: "/hobbies/$hobbySlug" });
  const { quizId, name, mode } = Route.useSearch();
  return (
    <HobbyQuizInner
      key={`${quizId}-${mode}`}
      hobbySlug={hobby.slug}
      quizId={quizId}
      name={name}
      mode={mode}
    />
  );
}

function HobbyQuizInner({
  hobbySlug,
  quizId,
  name,
  mode,
}: {
  hobbySlug: string;
  quizId: string;
  name: string;
  mode: QuizMode;
}) {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Array<QuizQuestion> | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Array<QuizQuestion> | null>(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | string | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Array<number | string>>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isReattempt, setIsReattempt] = useState(false);
  const [textInput, setTextInput] = useState("");

  const goBackRef = useRef<() => void>(() => {});
  goBackRef.current = () => {
    haptics.tap();
    navigate({ to: "/hobbies/$hobbySlug", params: { hobbySlug } });
  };

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      goBackRef.current();
    };
    window.addEventListener("appBackButton", handler);
    return () => window.removeEventListener("appBackButton", handler);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const saved = await loadHobbyQuizProgress(quizId);
      if (cancelled) return;

      const base = saved?.questions ?? getHobbyQuiz(quizId);
      setQuestions(base);

      if (saved && mode === "retake") {
        setActiveQuestions(base);
        setIdx(0);
        setScore(0);
        setAnswers([]);
        setPicked(null);
        setIsReattempt(true);
      } else if (saved && mode !== "normal") {
        setActiveQuestions(base);
        setIdx(saved.idx);
        setScore(saved.score);
        setAnswers(saved.answers);
        setPicked(saved.picked);
      } else if (saved && mode === "normal") {
        setActiveQuestions(base);
        setIdx(saved.idx);
        setScore(saved.score);
        setAnswers(saved.answers);
        setPicked(saved.picked);
      } else {
        setActiveQuestions(base);
      }

      setHydrated(true);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [quizId, mode]);

  useEffect(() => {
    if (!hydrated || !questions || !activeQuestions) return;
    void saveHobbyQuizProgress(quizId, { questions, idx, score, answers, picked });
  }, [hydrated, questions, activeQuestions, idx, score, answers, picked, quizId]);

  if (!questions || !activeQuestions) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="inline-block animate-pulse font-serif text-2xl tx-body">Lädt…</div>
      </div>
    );
  }

  const handleRetake = () => {
    setActiveQuestions(questions);
    setIdx(0);
    setPicked(null);
    setScore(0);
    setAnswers([]);
    setIsReattempt(true);
  };

  if (idx >= activeQuestions.length) {
    const pct = Math.round((score / activeQuestions.length) * 100);
    return (
      <Results
        score={score}
        total={activeQuestions.length}
        pct={pct}
        questions={activeQuestions}
        answers={answers}
        isReattempt={isReattempt}
        onBack={() => goBackRef.current()}
        onComplete={() => goBackRef.current()}
        onMarkDone={() => {}}
        onRetake={handleRetake}
      />
    );
  }

  const q = activeQuestions[idx];
  const answered = picked !== null;
  const isCorrectAnswer = isAnswerCorrect(q, picked);

  const handleTextSubmit = () => {
    const val = textInput.trim();
    if (!val) return;
    setPicked(val);
    setAnswers((prev) => [...prev, val]);
    if (isAnswerCorrect(q, val)) {
      setScore((s) => s + 1);
      haptics.correct();
    } else {
      haptics.wrong();
    }
  };

  return (
    <>
      <Header
        title={`Frage ${idx + 1} / ${activeQuestions.length}`}
        subtitle={name}
        secondaryAction={{
          label: "Hobby",
          icon: ChevronLeftIcon,
          onClick: () => goBackRef.current(),
        }}
      />
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-end gap-3 mb-8">
          <div className="text-xs font-mono tx-accent">● saved</div>
          <div className="text-xs font-mono tx-muted">Score: {score}</div>
        </div>

        <div className="mb-8">
          {q.type === "translate" ? (
            <div className="text-xs font-mono tx-muted uppercase tracking-wider mb-2">
              Translate to {q.direction === "en-de" ? "German" : "English"}
            </div>
          ) : null}
          <div className="font-serif text-2xl tx-text font-bold leading-snug">{getPrompt(q)}</div>
        </div>

        {q.type === "single-choice" ? (
          <div className="space-y-3 mb-6">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correct;
              const isPicked = i === picked;
              let cls =
                "w-full text-left p-4 border-2 bd-default bg-surface tx-text font-serif text-lg transition-colors";
              if (answered) {
                if (isCorrect) cls += " state-correct";
                else if (isPicked) cls += " state-wrong";
                else cls += " opacity-40";
              }
              return (
                <button
                  type="button"
                  key={opt}
                  disabled={answered}
                  onClick={() => {
                    setPicked(i);
                    setAnswers((prev) => [...prev, i]);
                    if (i === q.correct) {
                      setScore((s) => s + 1);
                      haptics.correct();
                    } else {
                      haptics.wrong();
                    }
                  }}
                  className={cls}
                >
                  <span className="font-mono text-sm tx-muted mr-3">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mb-6">
            {!answered ? (
              <>
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleTextSubmit();
                  }}
                  placeholder={
                    q.type === "fill-blank" ? "Type the missing word…" : "Type your translation…"
                  }
                  className="w-full border-2 bd-default bg-surface tx-body px-4 py-3 font-mono text-sm outline-none focus:bd-accent mb-3"
                />
                <button
                  type="button"
                  onClick={handleTextSubmit}
                  disabled={!textInput.trim()}
                  className="w-full bg-btn tx-btn py-3 font-bold border-2 bd-btn disabled:opacity-40"
                >
                  Prüfen
                </button>
              </>
            ) : (
              <div
                className={`px-4 py-3 border-2 font-mono ${isCorrectAnswer ? "state-correct" : "state-wrong"}`}
              >
                {typeof picked === "string" ? picked : ""}
              </div>
            )}
          </div>
        )}

        {answered ? (
          <div className="border-l-4 bd-accent bg-accent-bg p-4 mb-6">
            <div className="font-bold tx-text mb-1">{isCorrectAnswer ? "Richtig!" : "Falsch."}</div>
            <div className="tx-body text-sm">{q.explanation}</div>
          </div>
        ) : null}

        {answered ? (
          <button
            type="button"
            onClick={() => {
              setIdx((i) => i + 1);
              setPicked(null);
              setTextInput("");
              haptics.tap();
            }}
            className="w-full bg-btn tx-btn py-3 font-bold border-2 bd-btn"
          >
            <span className="flex items-center justify-center gap-2">
              {idx + 1 < activeQuestions.length ? "Next question" : "See results"}{" "}
              <ChevronRightIcon />
            </span>
          </button>
        ) : null}
      </div>
    </>
  );
}

export const Route = createFileRoute("/hobbies/$hobbySlug/quiz")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { quizId: string; name: string; mode: QuizMode } => ({
    quizId: String(search.quizId ?? ""),
    name: String(search.name ?? "Quiz"),
    mode: validateQuizMode(search.mode),
  }),
  component: HobbyQuizRoute,
});
