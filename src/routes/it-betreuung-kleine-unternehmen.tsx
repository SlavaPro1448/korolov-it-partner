import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

import { buildCanonicalLink, buildSeoMeta } from "@/lib/seo";
import { itBetreuungKleineUnternehmen as content } from "@/data/landing";

export const Route = createFileRoute("/it-betreuung-kleine-unternehmen")({
  head: () => ({
    meta: buildSeoMeta({
      title: content.seo.title,
      description: content.seo.description,
      path: content.path,
      locale: "de",
      keywords: content.seo.keywords,
    }),
    links: [buildCanonicalLink(content.path)],
  }),
  component: lazyRouteComponent(
    () => import("@/components/landing/ItBetreuungKleineUnternehmenPage"),
  ),
});
