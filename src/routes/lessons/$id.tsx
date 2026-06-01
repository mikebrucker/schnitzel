import { getLesson } from "@/lib/curriculum";
import type { Lesson } from "@/lib/types";
import { Outlet, createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/lessons/$id")({
  loader: ({ params }): { lesson: Lesson } => {
    const lesson = getLesson(Number(params.id));
    if (!lesson) throw notFound();
    return { lesson };
  },
  component: () => <Outlet />,
});
