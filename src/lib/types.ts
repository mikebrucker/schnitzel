export type Theme = "dark" | "light";

const LANGUAGE_PROFICIENCY_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type LanguageProficiencyLevel = (typeof LANGUAGE_PROFICIENCY_LEVELS)[number];
export function isLanguageProficiencyLevel(s: string): s is LanguageProficiencyLevel {
  return (LANGUAGE_PROFICIENCY_LEVELS as ReadonlyArray<string>).includes(s);
}

export type VocabItem = {
  de: string;
  en: string;
  note?: string;
};

export type Lesson = {
  id: number;
  level: LanguageProficiencyLevel;
  unit: number;
  lessonNum: number;
  title: string;
  titleDe: string;
  vocab: Array<VocabItem>;
  grammar: string;
  example: { de: string; en: string };
};

export type QuizQuestion = {
  question: string;
  options: Array<string>;
  correct: number;
  explanation: string;
};

export type TyroleanEntry = {
  tirol: string;
  standard: string;
  en: string;
};

export type QuizProgress = {
  idx: number;
  score: number;
  answers: Array<number>;
  picked: number | null;
};

export type Profile = {
  name: string;
  location: string;
  level: LanguageProficiencyLevel;
};

export type QuizMode = "normal" | "view" | "retake" | "wrong";

export type LessonStat = {
  score: number;
  total: number;
  finished: boolean;
  answered: number;
};
