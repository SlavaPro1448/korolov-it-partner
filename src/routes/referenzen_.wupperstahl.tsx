import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

import { buildCanonicalLink, buildSeoMeta } from "@/lib/seo";
import { getCaseBySlug } from "@/data/cases";

const detail = getCaseBySlug("wupperstahl")!.detail!;

export const Route = createFileRoute("/referenzen_/wupperstahl")({
  head: () => ({
    meta: buildSeoMeta({
      title: detail.seo.title,
      description: detail.seo.description,
      path: detail.path,
      locale: "de",
      keywords: detail.seo.keywords,
    }),
    links: [buildCanonicalLink(detail.path)],
  }),
  component: lazyRouteComponent(() => import("@/components/references/WupperstahlCasePage")),
});
