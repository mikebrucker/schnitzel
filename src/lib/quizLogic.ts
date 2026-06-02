import type { QuizQuestion } from "@/lib/types";

export function normalizeAnswer(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/ß/g, "ss")
    .replace(/[.,!?;:]+$/, "")
    .replace(/\s+/g, " ");
}

export function isAnswerCorrect(
  q: QuizQuestion,
  answer: number | string | null | undefined,
): boolean {
  if (answer === null || answer === undefined) return false;
  if (q.type === "single-choice") {
    return answer === q.correct;
  }
  if (q.type === "fill-blank" || q.type === "translate") {
    if (typeof answer !== "string") return false;
    const norm = normalizeAnswer(answer);
    if (norm === normalizeAnswer(q.answer)) return true;
    return q.acceptable.some((a) => normalizeAnswer(a) === norm);
  }
  return false;
}

export function getPrompt(q: QuizQuestion): string {
  if (q.type === "single-choice") return q.question;
  return q.prompt;
}

export function getCorrectDisplay(q: QuizQuestion): string {
  if (q.type === "single-choice") return q.options[q.correct];
  return q.answer;
}

export function getUserAnswerDisplay(
  q: QuizQuestion,
  answer: number | string | null | undefined,
): string {
  if (answer === null || answer === undefined) return "—";
  if (q.type === "single-choice") {
    if (typeof answer !== "number") return "—";
    return q.options[answer] ?? "—";
  }
  return typeof answer === "string" ? answer : "—";
}
