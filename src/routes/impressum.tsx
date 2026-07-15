import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

import { buildCanonicalLink, buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: buildSeoMeta({
      title: "Impressum | Korolov IT-Service",
      description: "Impressum von Korolov IT-Service — Angaben gemäß § 5 DDG.",
      path: "/impressum",
      locale: "de",
    }),
    links: [buildCanonicalLink("/impressum")],
  }),
  component: lazyRouteComponent(() => import("@/components/legal/ImpressumPage")),
});
