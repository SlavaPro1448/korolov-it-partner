import { createFileRoute, lazyRouteComponent, notFound } from "@tanstack/react-router";

import { getProject } from "@/data/projects";
import { buildCanonicalLink, buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/projekte_/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { slug: project.slug };
  },
  head: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) return {};
    const path = `/projekte/${project.slug}`;
    return {
      meta: buildSeoMeta({
        title: project.detail.seo.title,
        description: project.detail.seo.description,
        path,
        locale: "de",
      }),
      links: [buildCanonicalLink(path)],
    };
  },
  component: lazyRouteComponent(() => import("@/components/projects/ProjectRoutePage")),
});
