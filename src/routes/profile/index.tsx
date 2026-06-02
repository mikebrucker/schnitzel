import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { NavCard } from "@/components/card/NavCard";
import { StatCard } from "@/components/card/StatCard";
import { BarChartIcon, EditIcon, SettingsIcon, XIcon } from "@/components/icons";
import { CURRICULUM } from "@/lib/curriculum";
import { haptics } from "@/lib/haptics";
import { loadQuizProgress } from "@/lib/quizStorage";
import type { LanguageProficiencyLevel } from "@/lib/types";
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

  const languageProficiencyLevels: Record<LanguageProficiencyLevel, string> = {
    A1: "A1 - Beginner",
    A2: "A2 - Elementary",
    B1: "B1 - Intermediate",
    B2: "B2 - Upper intermediate",
    C1: "C1 - Advanced",
    C2: "C2 - Fluent",
  };

  return (
    <>
      <Header
        title="Profile"
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
                <Input
                  defaultValue={profile.name}
                  onChange={(value) => setProfile({ ...profile, name: value })}
                  className="font-serif text-2xl font-black"
                />
              ) : (
                <div className="font-serif text-2xl font-black tx-text truncate">
                  {profile.name}
                </div>
              )}
              {editing ? (
                <Input
                  defaultValue={profile.location}
                  onChange={(value) => setProfile({ ...profile, location: value })}
                  placeholder="Location"
                  className="text-sm mt-1"
                />
              ) : (
                <div className="text-sm tx-muted mt-1">📍 {profile.location}</div>
              )}
            </div>
          </div>

          {editing ? (
            <Select
              label="German Level"
              value={profile.level}
              onChange={(value) => setProfile({ ...profile, level: value })}
              className="font-serif"
              options={languageProficiencyLevels}
            />
          ) : (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono uppercase tracking-wider tx-muted">
                German Level
              </span>
              <div className="text-sm tx-text">
                {profile.level} —{" "}
                {
                  {
                    A1: "Beginner",
                    A2: "Elementary",
                    B1: "Intermediate",
                    B2: "Upper intermediate",
                    C1: "Advanced",
                    C2: "Fluent",
                  }[profile.level]
                }
              </div>
            </div>
          )}

          <div>
            {editing ? (
              <Button
                label="Done"
                variant="danger"
                size="sm"
                icon={<XIcon size={16} />}
                onClick={() => setEditing(false)}
              />
            ) : (
              <Button
                label="Edit profile"
                size="sm"
                icon={<EditIcon size={18} />}
                onClick={() => {
                  setEditing(true);
                  haptics.tap();
                }}
              />
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
            icon={<BarChartIcon size={32} />}
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
