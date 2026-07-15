import { createFileRoute } from "@tanstack/react-router";

import { HomePage } from "@/components/home/HomePage";
import { buildCanonicalLink, buildHreflangLinks, buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/ru")({
  head: () => ({
    meta: buildSeoMeta({
      title: "Korolov IT-Service | Сайты и IT-поддержка в Leverkusen",
      description:
        "Korolov IT-Service помогает малому бизнесу в Leverkusen, Köln и NRW с сайтами, почтой, хостингом, IT-поддержкой и цифровой организацией.",
      path: "/ru",
      locale: "ru",
      keywords:
        "IT-сервис Леверкузен, создание сайтов, IT-поддержка NRW, хостинг почты, цифровая организация",
    }),
    links: [buildCanonicalLink("/ru"), ...buildHreflangLinks()],
  }),
  component: () => <HomePage locale="ru" />,
});
