import { Header } from "@/components/Header";
import { NavCard } from "@/components/NavCard";
import { StatCard } from "@/components/card/StatCard";
import { EditIcon, SettingsIcon } from "@/components/icons";
import { CURRICULUM } from "@/lib/curriculum";
import { haptics } from "@/lib/haptics";
import { loadQuizProgress } from "@/lib/quizStorage";
import { useApp } from "@/store/useApp";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type Stats = {
  totalQuestions: number;
  totalCorrect: number;
  lessonsAttempted: number;
  lessonsCompleted: number;
};

function ProfileRoute() {
  const navigate = useNavigate();
  const profile = useApp((s) => s.profile);
  const setProfile = useApp((s) => s.setProfile);
  const completed = useApp((s) => s.completed);

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

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      let totalQuestions = 0;
      let totalCorrect = 0;
      let lessonsAttempted = 0;

      for (const lesson of CURRICULUM) {
        const saved = await loadQuizProgress(lesson.id);
        if (!saved) continue;
        const answered = saved.answers?.length ?? 0;
        if (answered > 0) lessonsAttempted++;
        totalQuestions += answered;
        totalCorrect += saved.score ?? 0;
      }

      if (!cancelled) {
        setStats({
          totalQuestions,
          totalCorrect,
          lessonsAttempted,
          lessonsCompleted: completed.size,
        });
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
    <>
      <Header
        title="Profil"
        subtitle="Mein Profil"
        secondaryAction={{
          label: "Settings",
          icon: <SettingsIcon size={16} />,
          onClick: () => {
            haptics.tap();
            navigate({ to: "/profile/settings" });
          },
        }}
      />
      <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col gap-8">
        <section className="flex flex-col gap-5">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 shrink-0 flex items-center justify-center font-black text-4xl rounded-sm bg-btn tx-btn">
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
                <div className="font-serif text-2xl font-black tx-text truncate">
                  {profile.name}
                </div>
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

          <div>
            <div className="text-xs font-mono uppercase tracking-wider tx-muted mb-2">
              German Level
            </div>
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
          </div>

          <div>
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
                className="flex items-center gap-2 border-2 bd-default bg-surface tx-text px-5 py-2 font-bold"
              >
                <EditIcon size={18} />
                <span>Edit profile</span>
              </button>
            )}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold tx-text mb-4 pb-1 border-b-2 bd-default">
            Statistiken
          </h2>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <StatCard
              label="Lessons done"
              value={`${stats.lessonsCompleted}/${CURRICULUM.length}`}
            />
            <StatCard label="Lessons started" value={String(stats.lessonsAttempted)} />
            <StatCard label="Questions answered" value={String(stats.totalQuestions)} />
            <StatCard
              label="Accuracy"
              value={`${accuracy}%`}
              sub={`${stats.totalCorrect} / ${stats.totalQuestions} correct`}
              accent
            />
          </div>
        </section>

        <section>
          <NavCard
            title="Progress"
            subtitle="Fortschritt"
            onClick={() => {
              haptics.tap();
              navigate({ to: "/profile/progress" });
            }}
          />
        </section>
      </div>
    </>
  );
}

export const Route = createFileRoute("/profile/")({
  component: ProfileRoute,
});
