import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card } from "@/components/card";
import { Header } from "@/components/Header";
import { ChevronLeftIcon } from "@/components/icons";
import type { ReorderItem } from "@/components/ReorderList";
import { ReorderList } from "@/components/ReorderList";
import { haptics } from "@/lib/haptics";
import { TABS } from "@/lib/tabs";
import type { Theme } from "@/lib/types";
import type { TabRoot } from "@/store/useApp";
import { useApp } from "@/store/useApp";

function SettingsRoute() {
  const navigate = useNavigate();
  const theme = useApp((s) => s.theme);
  const setTheme = useApp((s) => s.setTheme);
  const tabOrder = useApp((s) => s.tabOrder);
  const setTabOrder = useApp((s) => s.setTabOrder);
  const defaultTab = useApp((s) => s.defaultTab);
  const setDefaultTab = useApp((s) => s.setDefaultTab);

  const tabItems: Array<ReorderItem> = tabOrder
    .map((root) => TABS.find((t) => t.root === root))
    .filter((t): t is (typeof TABS)[number] => t !== undefined)
    .map(({ root, label, Icon }) => ({ id: root, label, Icon }));

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
      <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col gap-8">
        <section>
          <h2 className="font-serif text-2xl font-bold tx-text mb-4 border-b-2 bd-default pb-1">
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

        <section>
          <h2 className="font-serif text-2xl font-bold tx-text mb-4 border-b-2 bd-default pb-1">
            Tab Bar
          </h2>
          <ReorderList
            items={tabItems}
            selectedId={defaultTab}
            onReorder={(next) => setTabOrder(next.map((item) => item.id as TabRoot))}
            onSelect={setDefaultTab}
          />
        </section>
      </div>
    </>
  );
}

export const Route = createFileRoute("/profile/settings")({
  component: SettingsRoute,
});
