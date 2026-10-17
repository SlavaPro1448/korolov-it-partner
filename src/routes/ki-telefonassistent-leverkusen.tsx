import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

import { buildCanonicalLink, buildSeoMeta } from "@/lib/seo";
import { kiTelefonassistentLeverkusen as content } from "@/data/landing-ki";

export const Route = createFileRoute("/ki-telefonassistent-leverkusen")({
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
    () => import("@/components/landing/KiTelefonassistentLeverkusenPage"),
  ),
});
