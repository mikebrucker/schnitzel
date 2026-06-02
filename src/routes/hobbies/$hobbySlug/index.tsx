import { Chip } from "@/components/Chip";
import { Header } from "@/components/Header";
import { Card } from "@/components/card";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { getPhrase, getWord } from "@/lib/curriculum";
import { haptics } from "@/lib/haptics";
import type { DictionaryEntry, PhrasebookEntry, QuizMode } from "@/lib/types";
import { loadHobbyQuizProgress } from "@/storage/quizStorage";
import { createFileRoute, useLoaderData, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type QuizSummary = { score: number; total: number; finished: boolean; answered: number };

function HobbyDetailRoute() {
  const { hobby } = useLoaderData({ from: "/hobbies/$hobbySlug" });
  const navigate = useNavigate();
  const [open, setOpen] = useState<string>(hobby.subdomains[0]?.id ?? "");
  const [quizSummaries, setQuizSummaries] = useState<Map<string, QuizSummary>>(new Map());

  useEffect(() => {
    void (async () => {
      const entries = await Promise.all(
        hobby.subdomains.map(async (sub) => {
          const saved = await loadHobbyQuizProgress(sub.quizId);
          if (!saved || saved.questions.length === 0) return null;
          return [
            sub.quizId,
            {
              score: saved.score,
              total: saved.questions.length,
              finished: saved.idx >= saved.questions.length,
              answered: saved.answers.length,
            },
          ] as const;
        }),
      );
      setQuizSummaries(new Map(entries.filter((e): e is NonNullable<typeof e> => e !== null)));
    })();
  }, [hobby.subdomains]);

  const goToQuiz = (quizId: string, name: string, mode: QuizMode) => {
    haptics.tap();
    navigate({
      to: "/hobbies/$hobbySlug/quiz",
      params: { hobbySlug: hobby.slug },
      search: { quizId, name, mode },
    });
  };

  return (
    <>
      <Header
        title={hobby.name}
        subtitle={hobby.nameDe}
        secondaryAction={{
          label: "Hobbys",
          icon: ChevronLeftIcon,
          onClick: () => {
            haptics.tap();
            navigate({ to: "/hobbies" });
          },
        }}
      />
      <div className="max-w-4xl mx-auto px-4 py-4 space-y-3">
        {hobby.subdomains.map((sub) => {
          const isOpen = open === sub.id;
          const vocab = sub.vocabIds
            .map((id) => getWord(id))
            .filter((w): w is DictionaryEntry => w !== undefined);
          const phrases = sub.phraseIds
            .map((id) => getPhrase(id))
            .filter((p): p is PhrasebookEntry => p !== undefined);
          const summary = quizSummaries.get(sub.quizId);

          return (
            <div key={sub.id} className="border-2 bd-default bg-surface">
              <button
                type="button"
                onClick={() => {
                  haptics.tap();
                  setOpen(isOpen ? "" : sub.id);
                }}
                className="w-full p-4 flex items-center gap-3 text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-serif font-bold tx-text">{sub.name}</span>
                    {sub.focus === "primary" ? (
                      <Chip label="primary" variant="accent" fill="filled" />
                    ) : null}
                  </div>
                  <div className="text-xs font-mono tx-muted mt-0.5">{sub.nameDe}</div>
                </div>
                <span className="text-xs font-mono tx-muted shrink-0">{vocab.length} words</span>
                {summary?.finished ? (
                  <Chip
                    label={`${summary.score}/${summary.total}`}
                    variant="accent"
                    fill="filled"
                  />
                ) : summary ? (
                  <span className="text-xs font-mono tx-muted shrink-0">
                    {summary.answered}/{summary.total}
                  </span>
                ) : null}
                <ChevronRightIcon
                  className={`tx-muted shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`}
                />
              </button>

              {isOpen ? (
                <div className="border-t-2 bd-default">
                  {vocab.length > 0 ? (
                    <div className="divide-y bd-default">
                      {vocab.map((w) => (
                        <div
                          key={w.id}
                          className="px-4 py-3 grid grid-cols-[1fr_1fr] gap-3 items-start"
                        >
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-serif font-bold tx-text">{w.de}</span>
                            {w.gender !== null ? <Chip label={w.gender} /> : null}
                            {w.loanword === true ? (
                              <Chip label="EN" variant="default" fill="outline" />
                            ) : null}
                          </div>
                          <div>
                            <div className="tx-body text-sm">{w.en}</div>
                            {w.note !== null ? (
                              <div className="text-xs tx-muted mt-0.5 italic">{w.note}</div>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {phrases.length > 0 ? (
                    <div className="border-t-2 bd-default px-4 py-3">
                      <div className="text-xs font-mono tx-muted uppercase tracking-wider mb-2">
                        Key Phrases
                      </div>
                      <div className="space-y-2">
                        {phrases.map((p) => (
                          <div key={p.id}>
                            <div className="font-serif tx-text text-sm font-bold">{p.de}</div>
                            <div className="tx-muted text-xs">{p.en}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="border-t-2 bd-default p-4">
                    {summary ? (
                      <Card.Progress
                        value={summary.score}
                        max={summary.total}
                        height={4}
                        label={`${summary.score}/${summary.total}`}
                        className="mb-3"
                      />
                    ) : null}
                    {summary?.finished ? (
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => goToQuiz(sub.quizId, sub.name, "retake")}
                          className="flex-1 border-2 bd-default bg-surface tx-text py-3 font-bold text-sm"
                        >
                          Retake
                        </button>
                        <button
                          type="button"
                          onClick={() => goToQuiz(sub.quizId, sub.name, "view")}
                          className="flex-1 bg-btn tx-btn py-3 font-bold border-2 bd-btn text-sm flex items-center justify-center gap-2"
                        >
                          View Results <ChevronRightIcon />
                        </button>
                      </div>
                    ) : summary ? (
                      <button
                        type="button"
                        onClick={() => goToQuiz(sub.quizId, sub.name, "normal")}
                        className="w-full bg-btn tx-btn py-3 font-bold border-2 bd-btn flex items-center justify-center gap-2"
                      >
                        Continue Quiz <ChevronRightIcon />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => goToQuiz(sub.quizId, sub.name, "normal")}
                        className="w-full bg-btn tx-btn py-3 font-bold border-2 bd-btn flex items-center justify-center gap-2"
                      >
                        Take Quiz <ChevronRightIcon />
                      </button>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </>
  );
}

export const Route = createFileRoute("/hobbies/$hobbySlug/")({
  component: HobbyDetailRoute,
});
