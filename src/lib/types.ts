export type Theme = "dark" | "light";

export type VocabItem = {
  de: string;
  en: string;
  note?: string;
};

export type Lesson = {
  id: number;
  level: string;
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
  level: string;
};

export type QuizMode = "normal" | "view" | "retake" | "wrong";

export type LessonStat = {
  score: number;
  total: number;
  finished: boolean;
  answered: number;
};
