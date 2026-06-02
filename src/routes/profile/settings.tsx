import { Header } from "@/components/Header";
import { Card } from "@/components/card";
import { ChevronLeftIcon } from "@/components/icons";
import { haptics } from "@/lib/haptics";
import type { Theme } from "@/lib/types";
import { useApp } from "@/store/useApp";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

function SettingsRoute() {
  const navigate = useNavigate();
  const theme = useApp((s) => s.theme);
  const setTheme = useApp((s) => s.setTheme);

  return (
    <>
      <Header
        title="Einstellungen"
        subtitle="Settings"
        secondaryAction={{
          label: "Profil",
          icon: ChevronLeftIcon,
          onClick: () => {
            haptics.tap();
            navigate({ to: "/profile" });
          },
        }}
      />
      <div className="max-w-4xl mx-auto px-4 py-4">
        <section>
          <h2 className="font-serif text-xl font-bold tx-text mb-4 pb-1 border-b-2 bd-default">
            Theme
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {(["light", "dark"] as Array<Theme>).map((t) => {
              const active = theme === t;
              return (
                <Card
                  key={t}
                  variant={active ? "accent" : "default"}
                  onClick={() => {
                    setTheme(t);
                    haptics.tap();
                  }}
                >
                  <Card.Title size="xs" className="capitalize">
                    {t}
                  </Card.Title>
                  <Card.Subtitle size="xs">
                    {t === "dark" ? "Chalkboard mode" : "Paper mode"}
                  </Card.Subtitle>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}

export const Route = createFileRoute("/profile/settings")({
  component: SettingsRoute,
});
