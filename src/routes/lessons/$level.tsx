import { CURRICULUM } from "@/lib/curriculum";
import { Outlet, createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/lessons/$level")({
  loader: ({ params }) => {
    const level = params.level.toUpperCase();
    if (!CURRICULUM.some((l) => l.level === level)) throw notFound();
    return { level };
  },
  component: () => <Outlet />,
});
