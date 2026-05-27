import lessonsRaw from "@/data/lessons.json";
import quizzesRaw from "@/data/quizzes.json";
import tyroleanRaw from "@/data/tirolean.json";
import type { Lesson, QuizQuestion, TyroleanEntry } from "@/lib/types";

export const CURRICULUM: Array<Lesson> = lessonsRaw as Array<Lesson>;

export const QUIZZES: Record<string, Array<QuizQuestion>> = quizzesRaw as Record<string, Array<QuizQuestion>>;

export const TYROLEAN: Array<TyroleanEntry> = tyroleanRaw as Array<TyroleanEntry>;

export function getQuiz(lessonId: number): Array<QuizQuestion> {
  return QUIZZES[String(lessonId)] ?? [];
}

export function getLesson(id: number): Lesson | undefined {
  return CURRICULUM.find((l) => l.id === id);
}
