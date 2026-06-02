import { CURRICULUM } from "@/lib/curriculum";
import { isLanguageProficiencyLevel } from "@/lib/types";
import { Outlet, createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/lessons/$level")({
  loader: ({ params }) => {
    const level = params.level.toUpperCase();
    if (!isLanguageProficiencyLevel(level) || !CURRICULUM.some((l) => l.level === level))
      throw notFound();
    return { level };
  },
  component: () => <Outlet />,
});
