import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hobbies")({
  component: () => <Outlet />,
});
