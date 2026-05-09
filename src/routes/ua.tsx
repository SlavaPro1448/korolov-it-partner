import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/ua")({
  beforeLoad: () => {
    throw redirect({ to: "/uk", statusCode: 301 });
  },
});
