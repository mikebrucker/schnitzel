export type Theme = "dark" | "light";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export const languageProficiencyLevels: Record<LanguageProficiencyLevel, string> = {
  A1: "Beginner",
  A2: "Elementary",
  B1: "Intermediate",
  B2: "Upper intermediate",
  C1: "Advanced",
  C2: "Fluent",
};
export type LanguageProficiencyLevel = (typeof LEVELS)[number];
export function isLanguageProficiencyLevel(s: string): s is LanguageProficiencyLevel {
  return (LEVELS as ReadonlyArray<string>).includes(s);
}

export type DictionaryEntry = {
  id: string;
  de: string;
  lemma: string;
  en: string;
  partOfSpeech: string;
  gender: "der" | "die" | "das" | null;
  plural: string | null;
  ipa: string | null;
  level: LanguageProficiencyLevel;
  tags: Array<string>;
  note: string | null;
  exampleSentence: { de: string; en: string } | null;
  audio: string | null;
  lessonIds: Array<number>;
};

export type GrammarPoint = {
  id: string;
  point: string;
  explanation: string;
  examples: Array<{ de: string; en: string }>;
};

export type Lesson = {
  id: number;
  slug: string;
  level: LanguageProficiencyLevel;
  unit: number;
  lessonNum: number;
  order: number;
  title: string;
  titleDe: string;
  estimatedMinutes: number;
  prerequisites: Array<number>;
  objectives: Array<string>;
  vocabIds: Array<string>;
  grammar: Array<GrammarPoint>;
  examples: Array<{ de: string; en: string }>;
  culturalNote: string | null;
  quizId: string;
  audio: string | null;
};

export type SingleChoiceQuestion = {
  id: string;
  type: "single-choice";
  difficulty: number;
  vocabId?: string;
  question: string;
  options: Array<string>;
  correct: number;
  explanation: string;
};

export type QuizQuestion = SingleChoiceQuestion;

export type TyroleanEntry = {
  id: string;
  tirol: string;
  standard: string;
  en: string;
  category: string;
  region: string;
  usage: string;
  note: string | null;
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
