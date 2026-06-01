import { CURRICULUM } from "@/lib/curriculum";
import type { Lesson } from "@/lib/types";
import { Outlet, createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/lessons/$level/$unit/$lessonNum")({
  loader: ({ params }): { lesson: Lesson } => {
    const lesson = CURRICULUM.find(
      (l) =>
        l.level === params.level.toUpperCase() &&
        l.unit === Number(params.unit) &&
        l.lessonNum === Number(params.lessonNum),
    );
    if (!lesson) throw notFound();
    return { lesson };
  },
  component: () => <Outlet />,
});
