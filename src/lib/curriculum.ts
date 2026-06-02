import dictionaryRaw from "@/data/dictionary.json";
import lessonsRaw from "@/data/lessons.json";
import quizzesRaw from "@/data/quizzes.json";
import tyroleanRaw from "@/data/tirolean.json";
import type { DictionaryEntry, Lesson, QuizQuestion, TyroleanEntry } from "@/lib/types";

export const CURRICULUM: Array<Lesson> = lessonsRaw as Array<Lesson>;

type QuizRecord = Record<string, { lessonId: number; questions: Array<QuizQuestion> }>;
export const QUIZZES: QuizRecord = quizzesRaw as QuizRecord;

export const DICTIONARY: Array<DictionaryEntry> = dictionaryRaw as Array<DictionaryEntry>;

export const TYROLEAN: Array<TyroleanEntry> = tyroleanRaw as Array<TyroleanEntry>;

export function getQuiz(lessonId: number): Array<QuizQuestion> {
  const lesson = getLesson(lessonId);
  if (!lesson) return [];
  return QUIZZES[lesson.quizId]?.questions ?? [];
}

export function getLesson(id: number): Lesson | undefined {
  return CURRICULUM.find((l) => l.id === id);
}

export function getWord(id: string): DictionaryEntry | undefined {
  return DICTIONARY.find((w) => w.id === id);
}

export function lessonToPath(lesson: Lesson): { level: string; unit: string; lessonNum: string } {
  return {
    level: lesson.level.toLowerCase(),
    unit: String(lesson.unit),
    lessonNum: String(lesson.lessonNum),
  };
}
