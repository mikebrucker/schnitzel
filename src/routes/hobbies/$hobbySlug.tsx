import { getHobby } from "@/lib/curriculum";
import type { Hobby } from "@/lib/types";
import { Outlet, createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/hobbies/$hobbySlug")({
  loader: ({ params }): { hobby: Hobby } => {
    const hobby = getHobby(params.hobbySlug);
    if (!hobby) throw notFound();
    return { hobby };
  },
  component: () => <Outlet />,
});
