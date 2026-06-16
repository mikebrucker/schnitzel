import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { CURRICULUM } from "@/lib/curriculum";
import { isLanguageProficiencyLevel } from "@/lib/types";

export const Route = createFileRoute("/lessons/$level/$unit")({
  loader: ({ params }) => {
    const level = params.level.toUpperCase();
    const unit = Number(params.unit);
    if (
      !isLanguageProficiencyLevel(level) ||
      !CURRICULUM.some((l) => l.level === level && l.unit === unit)
    )
      throw notFound();
    return { level, unit };
  },
  component: () => <Outlet />,
});
