import { createFileRoute } from "@tanstack/react-router";

import { HomePage } from "@/components/home/HomePage";
import { buildCanonicalLink, buildHreflangLinks, buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/uk")({
  head: () => ({
    meta: buildSeoMeta({
      title: "Korolov IT-Service | Сайти та IT-підтримка в Leverkusen",
      description:
        "Korolov IT-Service допомагає малому бізнесу в Leverkusen, Köln і NRW із сайтами, поштою, хостингом та IT-підтримкою.",
      path: "/uk",
      locale: "uk",
      localeAlternates: true,
      keywords:
        "IT-сервіс Леверкузен, створення сайтів, IT-підтримка NRW, хостинг пошти, цифрова організація",
    }),
    links: [buildCanonicalLink("/uk"), ...buildHreflangLinks()],
  }),
  component: () => <HomePage locale="uk" />,
});
