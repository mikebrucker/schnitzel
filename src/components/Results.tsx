import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, XIcon } from "@/components/icons";
import { haptics } from "@/lib/haptics";
import type { QuizQuestion } from "@/lib/types";
import { useEffect, useState } from "react";

type Props = {
  score: number;
  total: number;
  pct: number;
  questions: Array<QuizQuestion>;
  answers: Array<number>;
  isReattempt: boolean;
  onBack: () => void;
  onComplete: () => void;
  onMarkDone: () => void;
  onRetake: () => void;
};

export function Results({
  score,
  total,
  pct,
  questions,
  answers,
  isReattempt,
  onBack,
  onComplete,
  onMarkDone,
  onRetake,
}: Props) {
  const [reviewing, setReviewing] = useState(false);

  // Mark complete only on a perfect canonical attempt — re-attempts and sub-100% don't unlock the next lesson.
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional mount-only effect
  useEffect(() => {
    if (!isReattempt && pct === 100) onMarkDone();
  }, []);

  if (reviewing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-4">
        <button
          type="button"
          onClick={() => setReviewing(false)}
          className="text-sm font-mono mb-6 tx-muted"
        >
          <ChevronLeftIcon size={14} className="inline-block" /> Back to results
        </button>
        <div className="text-xs font-mono uppercase tracking-[0.3em] tx-muted mb-2">
          Antworten überprüfen
        </div>
        <h1 className="font-serif text-3xl font-black tx-text mb-8">Your answers</h1>
        <div className="space-y-4">
          {questions.map((q, i) => {
            const picked = answers[i];
            const isCorrect = picked === q.correct;
            return (
              <div key={q.question} className="border-2 bd-default bg-surface p-4">
                <div className="text-xs font-mono tx-muted mb-2">Question {i + 1}</div>
                <div className="font-serif font-bold tx-text mb-3">{q.question}</div>
                <div className="text-sm mb-1">
                  <span className="font-mono tx-muted">You: </span>
                  <span className={isCorrect ? "tx-accent" : "tx-wrong"}>
                    {q.options[picked]}{" "}
                    {isCorrect ? (
                      <CheckIcon size={14} className="inline-block" />
                    ) : (
                      <XIcon size={14} className="inline-block" />
                    )}
                  </span>
                </div>
                {!isCorrect ? (
                  <div className="text-sm mb-1">
                    <span className="font-mono tx-muted">Correct: </span>
                    <span className="tx-accent">{q.options[q.correct]}</span>
                  </div>
                ) : null}
                <div className="text-m tx-body mt-2 pt-2 border-t bd-default">{q.explanation}</div>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setReviewing(false)}
          className="w-full mt-6 border-2 bd-btn bg-btn tx-btn py-3 font-bold"
        >
          Back to results
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-center">
      <div className="text-xs font-mono uppercase tracking-[0.3em] tx-muted mb-3">
        {isReattempt ? "Practice fertig" : "Quiz fertig"}
      </div>
      <div className="font-serif text-7xl font-black tx-text mb-2">
        {score}/{total}
      </div>
      <div className="tx-muted mb-8">{pct}% correct</div>
      <div className="font-serif text-2xl tx-body mb-10">
        {pct >= 80
          ? "Sehr gut! 🎉"
          : pct >= 60
            ? "Nicht schlecht — keep going."
            : "Review the lesson and try again."}
      </div>
      <div className="flex flex-col gap-3 max-w-xs mx-auto">
        <button
          type="button"
          onClick={() => {
            setReviewing(true);
            haptics.tap();
          }}
          className="border-2 bd-default tx-text bg-surface px-6 py-3 font-bold"
        >
          Review answers
        </button>
        <button
          type="button"
          onClick={() => {
            onRetake();
            haptics.tap();
          }}
          className="border-2 bd-default tx-text bg-surface px-6 py-3 font-bold"
        >
          Retake quiz
        </button>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 border-2 bd-default tx-text bg-surface px-4 py-3 font-bold text-sm"
          >
            Lesson
          </button>
          <button
            type="button"
            onClick={onComplete}
            className="flex-1 border-2 bd-btn bg-btn tx-btn px-4 py-3 font-bold text-sm"
          >
            <span className="flex items-center justify-center gap-2">
              Home <ChevronRightIcon size={16} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
