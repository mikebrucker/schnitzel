import type { QuizProgress, QuizQuestion } from "@/lib/types";
import { storage } from "@/storage/storage";

type SavedQuizState = QuizProgress & {
  questions: Array<QuizQuestion>;
};

function key(lessonId: number): string {
  return `quiz-progress:${lessonId}`;
}

export async function loadQuizProgress(lessonId: number): Promise<SavedQuizState | null> {
  return await storage.getJSON<SavedQuizState>(key(lessonId));
}

export async function saveQuizProgress(lessonId: number, state: SavedQuizState): Promise<void> {
  await storage.setJSON(key(lessonId), state);
}

export async function clearQuizProgress(lessonId: number): Promise<void> {
  await storage.remove(key(lessonId));
}
