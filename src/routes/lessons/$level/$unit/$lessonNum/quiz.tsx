import { Header } from "@/components/Header";
import { Results } from "@/components/Results";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { getQuiz, lessonToPath } from "@/lib/curriculum";
import { haptics } from "@/lib/haptics";
import type { Lesson, QuizMode, QuizQuestion } from "@/lib/types";
import { loadQuizProgress, saveQuizProgress } from "@/storage/quizStorage";
import { useApp } from "@/store/useApp";
import { createFileRoute, useLoaderData, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

function validateQuizMode(m: unknown): QuizMode {
  return m === "view" || m === "retake" || m === "wrong" || m === "normal" ? m : "normal";
}

function QuizRoute() {
  const { lesson } = useLoaderData({ from: "/lessons/$level/$unit/$lessonNum" });
  const { mode } = Route.useSearch();
  return <QuizInner key={`${lesson.id}-${mode}`} lesson={lesson} mode={mode} />;
}

function QuizInner({ lesson, mode }: { lesson: Lesson; mode: QuizMode }) {
  const navigate = useNavigate();
  const setActiveLesson = useApp((s) => s.setActiveLesson);
  const setQuizMode = useApp((s) => s.setQuizMode);
  const markLessonComplete = useApp((s) => s.markLessonComplete);

  useEffect(() => {
    setActiveLesson(lesson);
    setQuizMode(mode);
  }, [lesson, mode, setActiveLesson, setQuizMode]);

  const [questions, setQuestions] = useState<Array<QuizQuestion> | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Array<QuizQuestion> | null>(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Array<number>>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isReattempt, setIsReattempt] = useState(false);

  const [wrongIndices, setWrongIndices] = useState<Array<number>>([]);
  const [canonicalAnswers, setCanonicalAnswers] = useState<Array<number>>([]);
  const [mergedAndSaved, setMergedAndSaved] = useState(false);

  const path = lessonToPath(lesson);

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
    navigate({ to: "/lessons/$level/$unit/$lessonNum", params: path });
  };

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      handleBackRef.current();
    };
    window.addEventListener("appBackButton", handler);
    return () => window.removeEventListener("appBackButton", handler);
  }, []);

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

  useEffect(() => {
    if (!hydrated || !questions) return;
    if (mode === "wrong") return;
    saveQuizProgress(lesson.id, { questions, idx, score, answers, picked });
  }, [hydrated, questions, idx, score, answers, picked, mode, lesson.id]);

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
        onBack={() => navigate({ to: "/lessons/$level/$unit/$lessonNum", params: path })}
        onComplete={() => navigate({ to: "/" })}
        onMarkDone={() => markLessonComplete(lesson.id)}
        onRetake={handleRetake}
      />
    );
  }

  const q = activeQuestions[idx];
  const answered = picked !== null;
  const correct = picked === q.correct;

  return (
    <>
      <Header
        title={`Frage ${idx + 1} / ${activeQuestions.length}`}
        subtitle={`${lesson.level} · Unit ${lesson.unit}`}
        secondaryAction={{
          label: "Lektion",
          icon: ChevronLeftIcon,
          onClick: () => handleBackRef.current(),
        }}
      />
      <div className="max-w-4xl mx-auto px-4 py-4">
        {mode === "wrong" && isReattempt ? (
          <div className="mb-4 px-3 py-2 border-2 bd-default bg-surface text-xs font-mono tx-muted text-center">
            Correcting wrong answers
          </div>
        ) : null}
        <div className="flex items-center justify-end gap-3 mb-8">
          <div className="text-xs font-mono tx-accent" title="Progress auto-saved">
            ● saved
          </div>
          <div className="text-xs font-mono tx-muted">Score: {score}</div>
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

        {answered ? (
          <div className="border-l-4 bd-accent bg-accent-bg p-4 mb-6">
            <div className="font-bold tx-text mb-1">{correct ? "Richtig!" : "Falsch."}</div>
            <div className="tx-body text-sm">{q.explanation}</div>
          </div>
        ) : null}

        {answered ? (
          <button
            type="button"
            onClick={() => {
              setIdx((i) => i + 1);
              setPicked(null);
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

export const Route = createFileRoute("/lessons/$level/$unit/$lessonNum/quiz")({
  validateSearch: (search: Record<string, unknown>): { mode: QuizMode } => ({
    mode: validateQuizMode(search.mode),
  }),
  component: QuizRoute,
});
