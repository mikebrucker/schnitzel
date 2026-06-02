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
  hobbyIds?: Array<string>;
  loanword?: boolean;
  conjugationId?: string;
  irregular?: boolean;
};

export type PhrasebookEntry = {
  id: string;
  category: string;
  de: string;
  en: string;
  literal: string | null;
  ipa: string | null;
  formality: "formal" | "neutral" | "casual";
  tags: Array<string>;
  audio: string | null;
  hobbyIds: Array<string>;
};

export type HobbySubdomain = {
  id: string;
  slug: string;
  name: string;
  nameDe: string;
  focus: "primary" | "secondary";
  vocabIds: Array<string>;
  phraseIds: Array<string>;
  quizId: string;
};

export type Hobby = {
  id: string;
  slug: string;
  name: string;
  nameDe: string;
  icon: string;
  level: LanguageProficiencyLevel;
  blurb: string;
  subdomains: Array<HobbySubdomain>;
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

export type FillBlankQuestion = {
  id: string;
  type: "fill-blank";
  difficulty: number;
  vocabId?: string;
  prompt: string;
  answer: string;
  acceptable: Array<string>;
  explanation: string;
};

export type TranslateQuestion = {
  id: string;
  type: "translate";
  difficulty: number;
  vocabId?: string;
  direction: "en-de" | "de-en";
  prompt: string;
  answer: string;
  acceptable: Array<string>;
  explanation: string;
};

export type QuizQuestion = SingleChoiceQuestion | FillBlankQuestion | TranslateQuestion;

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
  answers: Array<number | string>;
  picked: number | string | null;
};

export type Profile = {
  name: string;
  location: string;
  level: LanguageProficiencyLevel;
};

export type ConjugationTense = {
  ich: string;
  du: string;
  er_sie_es: string;
  wir: string;
  ihr: string;
  sie_Sie: string;
};

export type ConjugationEntry = {
  id: string;
  infinitive: string;
  english: string;
  auxiliary: "haben" | "sein";
  irregular: boolean;
  tenses: {
    present: ConjugationTense;
    past: ConjugationTense;
    perfect: {
      participle: string;
      example: string;
    };
  };
};

export type QuizMode = "normal" | "view" | "retake" | "wrong";

export type LessonStat = {
  score: number;
  total: number;
  finished: boolean;
  answered: number;
};
