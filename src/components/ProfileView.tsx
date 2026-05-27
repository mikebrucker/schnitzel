import { CURRICULUM } from "@/lib/curriculum";
import { haptics } from "@/lib/haptics";
import { loadQuizProgress } from "@/lib/quizStorage";
import { scoreCardBg, scoreTextClass } from "@/lib/scoreColors";
import type { LessonStat } from "@/lib/types";
import { useApp } from "@/store/useApp";
import { useEffect, useState } from "react";

type Stats = {
  totalQuestions: number;
  totalCorrect: number;
  lessonsAttempted: number;
  lessonsCompleted: number;
};

type LessonEntry = (LessonStat & { id: number; title: string }) | null;

export function ProfileView() {
  const setView = useApp((s) => s.setView);
  const profile = useApp((s) => s.profile);
  const setProfile = useApp((s) => s.setProfile);
  const completed = useApp((s) => s.completed);
  const theme = useApp((s) => s.theme);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [location, setLocation] = useState(profile.location);
  const [level, setLevel] = useState(profile.level);
  const [stats, setStats] = useState<Stats>({
    totalQuestions: 0,
    totalCorrect: 0,
    lessonsAttempted: 0,
    lessonsCompleted: 0,
  });
  const [lessonStats, setLessonStats] = useState<Array<LessonEntry>>([]);

  // Compute stats from saved quiz progress
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      let totalQuestions = 0;
      let totalCorrect = 0;
      let lessonsAttempted = 0;
      const perLesson: Array<LessonEntry> = [];

      for (const lesson of CURRICULUM) {
        const saved = await loadQuizProgress(lesson.id);
        if (!saved) {
          perLesson.push(null);
          continue;
        }
        const answered = saved.answers?.length ?? 0;
        if (answered > 0) lessonsAttempted++;
        totalQuestions += answered;
        totalCorrect += saved.score ?? 0;
        perLesson.push({
          id: lesson.id,
          title: lesson.title,
          score: saved.score,
          total: saved.questions.length,
          finished: saved.idx >= saved.questions.length,
          answered,
        });
      }

      if (!cancelled) {
        setStats({
          totalQuestions,
          totalCorrect,
          lessonsAttempted,
          lessonsCompleted: completed.size,
        });
        setLessonStats(perLesson);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [completed]);

  const accuracy =
    stats.totalQuestions > 0 ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) : 0;

  const save = () => {
    setProfile({ name, location, level });
    setEditing(false);
    haptics.tap();
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <button
        type="button"
        onClick={() => {
          setView("home");
          haptics.tap();
        }}
        className="text-sm font-mono mb-6 tx-muted"
      >
        ← Back
      </button>

      <div className="text-xs font-mono uppercase tracking-[0.3em] tx-muted mb-2">Mein Profil</div>
      <h1 className="font-serif text-4xl font-black tx-text mb-8">Profile</h1>

      <div className="flex items-center gap-5 mb-8">
        <div className="w-20 h-20 flex items-center justify-center font-black text-4xl rounded-sm bg-btn tx-btn">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="font-serif text-2xl font-black tx-text bg-surface border-2 bd-default px-2 py-1 w-full"
            />
          ) : (
            <div className="font-serif text-2xl font-black tx-text truncate">{profile.name}</div>
          )}
          {editing ? (
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="text-sm tx-muted bg-surface border-2 bd-default px-2 py-1 w-full mt-1"
            />
          ) : (
            <div className="text-sm tx-muted mt-1">📍 {profile.location}</div>
          )}
        </div>
      </div>

      <section className="mb-8">
        <div className="text-xs font-mono uppercase tracking-wider tx-muted mb-2">German Level</div>
        {editing ? (
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full bg-surface border-2 bd-default tx-text px-3 py-2 font-serif"
          >
            <option>A1 — Beginner</option>
            <option>A2 — Elementary</option>
            <option>B1 — Intermediate</option>
            <option>B2 — Upper intermediate</option>
            <option>C1 — Advanced</option>
            <option>C2 — Fluent</option>
          </select>
        ) : (
          <div className="border-2 bd-default bg-surface px-4 py-3 font-serif tx-text">
            {profile.level}
          </div>
        )}
      </section>

      <div className="mb-10">
        {editing ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={save}
              className="flex-1 border-2 bd-btn bg-btn tx-btn py-2 font-bold"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setName(profile.name);
                setLocation(profile.location);
                setLevel(profile.level);
              }}
              className="flex-1 border-2 bd-default bg-surface tx-text py-2 font-bold"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setEditing(true);
              haptics.tap();
            }}
            className="border-2 bd-default bg-surface tx-text px-5 py-2 font-bold"
          >
            ✎ Edit profile
          </button>
        )}
      </div>

      <section className="mb-10">
        <h2 className="font-serif text-xl font-bold tx-text mb-4 pb-1 border-b-2 bd-default">
          Statistiken
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <StatTile label="Lessons done" value={`${stats.lessonsCompleted}/${CURRICULUM.length}`} />
          <StatTile label="Lessons started" value={String(stats.lessonsAttempted)} />
          <StatTile label="Questions answered" value={String(stats.totalQuestions)} />
          <StatTile
            label="Accuracy"
            value={`${accuracy}%`}
            sub={`${stats.totalCorrect} / ${stats.totalQuestions} correct`}
            accent
          />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-serif text-xl font-bold tx-text mb-4 pb-1 border-b-2 bd-default">
          Per Lesson
        </h2>
        <div className="space-y-2">
          {CURRICULUM.map((lesson, i) => {
            const s = lessonStats[i];
            const pct = s?.finished ? Math.round((s.score / s.total) * 100) : null;
            return (
              <div
                key={lesson.id}
                className="border-2 bd-default px-4 py-3"
                style={
                  s?.finished && pct !== null
                    ? { backgroundColor: scoreCardBg(pct, theme === "dark") }
                    : { backgroundColor: "var(--surface)" }
                }
              >
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="font-mono font-bold tx-text text-sm uppercase tracking-wider">
                      {lesson.unit} · L{lesson.id}
                    </span>
                    <span className="font-serif text-xs tx-muted ml-2">{lesson.title}</span>
                  </div>
                  {s?.finished ? (
                    <div
                      className={`font-mono font-bold text-sm shrink-0 ml-3 ${scoreTextClass(pct)}`}
                    >
                      {s.score}/{s.total} · {pct}%
                    </div>
                  ) : s ? (
                    <div className="font-mono text-xs tx-muted shrink-0 ml-3">
                      {s.answered}/{s.total} →
                    </div>
                  ) : (
                    <div className="font-mono text-xs tx-muted shrink-0 ml-3">not started</div>
                  )}
                </div>
                <div className="w-full h-1 bg-surface-solid mt-2">
                  {s?.finished && pct !== null && (
                    <div
                      className="h-full"
                      style={{ width: `${pct}%`, backgroundColor: "var(--accent-border)" }}
                    />
                  )}
                  {s && !s.finished && (
                    <div
                      className="h-full opacity-40"
                      style={{
                        width: `${Math.round((s.answered / s.total) * 100)}%`,
                        backgroundColor: "var(--accent-border)",
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function StatTile({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className={`border-2 p-4 ${accent ? "bd-accent bg-accent-bg" : "bd-default bg-surface"}`}>
      <div className="text-xs font-mono uppercase tracking-wider tx-muted mb-1">{label}</div>
      <div className={`font-serif text-3xl font-black ${accent ? "tx-accent" : "tx-text"}`}>
        {value}
      </div>
      {sub && <div className="text-xs font-mono tx-muted mt-1">{sub}</div>}
    </div>
  );
}
