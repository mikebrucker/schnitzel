import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useApp } from "@/store/useApp";

function IndexRoute() {
  const navigate = useNavigate();
  const defaultTab = useApp((s) => s.defaultTab);

  useEffect(() => {
    void navigate({ to: defaultTab, replace: true });
  }, [navigate, defaultTab]);

  return null;
}

export const Route = createFileRoute("/")({
  component: IndexRoute,
});
