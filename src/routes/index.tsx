import { createFileRoute } from "@tanstack/react-router";

import { HomePage } from "@/components/home/HomePage";
import { buildCanonicalLink, buildHreflangLinks, buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: buildSeoMeta({
      title: "Korolov IT-Service | Websites & IT-Support in Leverkusen",
      description:
        "Korolov IT-Service unterstützt kleine Unternehmen in Leverkusen, Köln und NRW bei Websites, E-Mail, Hosting, IT-Support und digitaler Organisation.",
      path: "/",
      locale: "de",
      keywords:
        "IT-Service Leverkusen, Website erstellen, IT-Support NRW, E-Mail Hosting, digitale Organisation",
    }),
    links: [buildCanonicalLink("/"), ...buildHreflangLinks()],
  }),
  component: () => <HomePage locale="de" />,
});
