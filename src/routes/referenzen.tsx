import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

import { buildCanonicalLink, buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/referenzen")({
  head: () => ({
    meta: buildSeoMeta({
      title: "Referenzen – Projekte & Kundenstimmen | Korolov IT-Service",
      description:
        "Ausgewählte Projekte aus Leverkusen und Umgebung: Webdesign für Metallbau, Hausverwaltung und Kanzlei sowie laufende IT-Betreuung. Mit Kundenstimmen.",
      path: "/referenzen",
      locale: "de",
      keywords:
        "Referenzen Korolov IT-Service, Webdesign Referenzen Leverkusen, IT-Service Kundenstimmen",
    }),
    links: [buildCanonicalLink("/referenzen")],
  }),
  component: lazyRouteComponent(() => import("@/components/landing/ReferenzenPage")),
});
