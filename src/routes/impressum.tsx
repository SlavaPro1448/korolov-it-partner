import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: buildSeoMeta({
      title: "Impressum | Korolov IT-Service",
      description: "Impressum von Korolov IT-Service — Angaben gemäß § 5 TMG.",
      path: "/impressum",
      locale: "de",
    }),
  }),
  component: lazyRouteComponent(() => import("@/components/legal/ImpressumPage")),
});
