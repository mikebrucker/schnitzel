import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { getHobby } from "@/lib/curriculum";
import type { Hobby } from "@/lib/types";

export const Route = createFileRoute("/hobbies/$hobbySlug")({
  loader: ({ params }): { hobby: Hobby } => {
    const hobby = getHobby(params.hobbySlug);
    if (!hobby) throw notFound();
    return { hobby };
  },
  component: () => <Outlet />,
});
