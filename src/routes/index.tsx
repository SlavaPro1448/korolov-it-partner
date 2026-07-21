import { createFileRoute } from "@tanstack/react-router";

import { HomePage } from "@/components/home/HomePage";
import { buildCanonicalLink, buildHreflangLinks, buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: buildSeoMeta({
      title: "IT-Service Leverkusen | IT-Betreuung für kleine Unternehmen",
      description:
        "IT-Service in Leverkusen: IT-Betreuung, Support, Beratung und Websites für kleine Unternehmen. Persönlicher Ansprechpartner, faire Preise, vor Ort & remote.",
      path: "/",
      locale: "de",
      keywords:
        "IT-Service Leverkusen, IT-Betreuung kleine Unternehmen, IT-Support Leverkusen, IT-Beratung Leverkusen, Webdesign Leverkusen",
    }),
    links: [buildCanonicalLink("/"), ...buildHreflangLinks()],
  }),
  component: () => <HomePage locale="de" />,
});
