import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

import { buildCanonicalLink, buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/projekte")({
  head: () => ({
    meta: buildSeoMeta({
      title: "Projekte: KI-Assistent, Apps & Bots | Korolov IT-Service",
      description:
        "Eigene KI-Systeme, iPhone-Apps und Bots aus Leverkusen: KI-Assistent Jarvis, Telefon-Dolmetscher, Live-Übersetzer, KI-Telefonassistent, Grosch – plus Kundenwebsites.",
      path: "/projekte",
      locale: "de",
      keywords:
        "KI Projekte Leverkusen, KI-Assistent, App-Entwicklung Leverkusen, Telegram-Bot, KI-Telefonassistent, Referenzen",
    }),
    links: [buildCanonicalLink("/projekte")],
  }),
  component: lazyRouteComponent(() => import("@/components/projects/ProjectsPage")),
});
