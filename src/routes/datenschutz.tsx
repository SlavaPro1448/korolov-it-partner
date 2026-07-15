import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

import { buildCanonicalLink, buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: buildSeoMeta({
      title: "Datenschutzerklärung | Korolov IT-Service",
      description: "Datenschutzerklärung von Korolov IT-Service nach DSGVO und BDSG.",
      path: "/datenschutz",
      locale: "de",
    }),
    links: [buildCanonicalLink("/datenschutz")],
  }),
  component: lazyRouteComponent(() => import("@/components/legal/DatenschutzPage")),
});
