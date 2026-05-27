import { Results } from "@/components/Results";
import { getQuiz } from "@/lib/curriculum";
import { haptics } from "@/lib/haptics";
import { loadQuizProgress, saveQuizProgress } from "@/lib/quizStorage";
import type { Lesson, QuizMode, QuizQuestion } from "@/lib/types";
import { useApp } from "@/store/useApp";
import { useEffect, useRef, useState } from "react";

export function QuizView({ lesson, mode }: { lesson: Lesson; mode: QuizMode }) {
  const setView = useApp((s) => s.setView);
  const markLessonComplete = useApp((s) => s.markLessonComplete);

  const [questions, setQuestions] = useState<Array<QuizQuestion> | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Array<QuizQuestion> | null>(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Array<number>>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isReattempt, setIsReattempt] = useState(false);

  // Wrong-mode merge tracking
  const [wrongIndices, setWrongIndices] = useState<Array<number>>([]);
  const [canonicalAnswers, setCanonicalAnswers] = useState<Array<number>>([]);
  const [mergedAndSaved, setMergedAndSaved] = useState(false);

  // Shared back handler — used by both UI button and Android hardware back
  const handleBackRef = useRef<() => void>(() => {});
  handleBackRef.current = () => {
    if (mode === "wrong" && wrongIndices.length > 0 && questions && !mergedAndSaved) {
      const merged = [...canonicalAnswers];
      answers.forEach((ans, i) => {
        merged[wrongIndices[i]] = ans;
      });
      const newScore = merged.filter((ans, i) => ans === questions[i]?.correct).length;
      void saveQuizProgress(lesson.id, {
        questions,
        idx: questions.length,
        score: newScore,
        answers: merged,
        picked: null,
      });
    }
    haptics.tap();
    setView("lesson");
  };

  // Android back button
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      handleBackRef.current();
    };
    window.addEventListener("appBackButton", handler);
    return () => window.removeEventListener("appBackButton", handler);
  }, []);

  // Load saved state + apply mode
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const saved = await loadQuizProgress(lesson.id);
      if (cancelled) return;

      const baseQuestions = saved?.questions ?? getQuiz(lesson.id);
      setQuestions(baseQuestions);

      if (saved && mode === "retake") {
        setActiveQuestions(baseQuestions);
        setIdx(0);
        setScore(0);
        setAnswers([]);
        setPicked(null);
        setIsReattempt(true);
      } else if (saved && mode === "wrong") {
        const indices = baseQuestions
          .map((_, i) => i)
          .filter(
            (i) => saved.answers[i] !== undefined && saved.answers[i] !== baseQuestions[i].correct,
          );

        setCanonicalAnswers(saved.answers);
        setWrongIndices(indices);

        if (indices.length === 0) {
          // All already correct — fall back to viewing canonical results
          setActiveQuestions(baseQuestions);
          setIdx(saved.idx);
          setScore(saved.score);
          setAnswers(saved.answers);
          setPicked(saved.picked);
        } else {
          setActiveQuestions(indices.map((i) => baseQuestions[i]));
          setIdx(0);
          setScore(0);
          setAnswers([]);
          setPicked(null);
          setIsReattempt(true);
        }
      } else if (saved) {
        // "normal" (resume) or "view" — restore exact saved state
        setActiveQuestions(baseQuestions);
        setIdx(saved.idx);
        setScore(saved.score);
        setAnswers(saved.answers);
        setPicked(saved.picked);
      } else {
        setActiveQuestions(baseQuestions);
      }

      setHydrated(true);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [lesson.id, mode]);

  // Persist on every change — all modes except wrong (wrong uses merge logic below)
  useEffect(() => {
    if (!hydrated || !questions) return;
    if (mode === "wrong") return;
    saveQuizProgress(lesson.id, { questions, idx, score, answers, picked });
  }, [hydrated, questions, idx, score, answers, picked, mode, lesson.id]);

  // Wrong-mode: merge corrected answers into canonical when quiz finishes
  useEffect(() => {
    if (!hydrated || !questions || !activeQuestions) return;
    if (mode !== "wrong" || !isReattempt || mergedAndSaved) return;
    if (wrongIndices.length === 0 || idx < activeQuestions.length) return;

    const merged = [...canonicalAnswers];
    answers.forEach((ans, i) => {
      merged[wrongIndices[i]] = ans;
    });
    const newScore = merged.filter((ans, i) => ans === questions[i]?.correct).length;
    void saveQuizProgress(lesson.id, {
      questions,
      idx: questions.length,
      score: newScore,
      answers: merged,
      picked: null,
    });
    setMergedAndSaved(true);
  }, [
    hydrated,
    questions,
    activeQuestions,
    mode,
    isReattempt,
    mergedAndSaved,
    wrongIndices,
    idx,
    canonicalAnswers,
    answers,
    lesson.id,
  ]);

  if (!questions || !activeQuestions) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
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
    setMergedAndSaved(false);
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
        onBack={() => setView("lesson")}
        onComplete={() => setView("home")}
        onMarkDone={() => markLessonComplete(lesson.id)}
        onRetake={handleRetake}
      />
    );
  }

  const q = activeQuestions[idx];
  const answered = picked !== null;
  const correct = picked === q.correct;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <button
        type="button"
        onClick={() => handleBackRef.current()}
        className="text-sm font-mono tx-muted mb-6"
      >
        ← Lesson
      </button>
      {mode === "wrong" && isReattempt && (
        <div className="mb-4 px-3 py-2 border-2 bd-default bg-surface text-xs font-mono tx-muted text-center">
          Correcting wrong answers
        </div>
      )}
      <div className="flex items-center justify-between mb-8">
        <div className="text-xs font-mono uppercase tracking-[0.3em] tx-muted">
          Question {idx + 1} / {activeQuestions.length}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono tx-accent" title="Progress auto-saved">
            ● saved
          </div>
          <div className="text-xs font-mono tx-muted">Score: {score}</div>
        </div>
      </div>

      <div className="font-serif text-2xl tx-text font-bold mb-8 leading-snug">{q.question}</div>

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

      {answered && (
        <div className="border-l-4 bd-accent bg-accent-bg p-4 mb-6">
          <div className="font-bold tx-text mb-1">{correct ? "Richtig!" : "Falsch."}</div>
          <div className="tx-body text-sm">{q.explanation}</div>
        </div>
      )}

      {answered && (
        <button
          type="button"
          onClick={() => {
            setIdx((i) => i + 1);
            setPicked(null);
            haptics.tap();
          }}
          className="w-full bg-btn tx-btn py-3 font-bold border-2 bd-btn"
        >
          {idx + 1 < activeQuestions.length ? "Next question →" : "See results →"}
        </button>
      )}
    </div>
  );
}
