import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/widerruf")({
  head: () => ({
    meta: buildSeoMeta({
      title: "Widerrufsbelehrung | Korolov IT-Service",
      description: "Widerrufsbelehrung für Verbraucher gemäß § 312g BGB.",
      path: "/widerruf",
      locale: "de",
    }),
  }),
  component: lazyRouteComponent(() => import("@/components/legal/WiderrufPage")),
});
