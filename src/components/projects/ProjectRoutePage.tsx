import { getRouteApi } from "@tanstack/react-router";

import { getProject } from "@/data/projects";

import { ProjectDetailPage } from "./ProjectDetailPage";

const route = getRouteApi("/projekte_/$slug");

export default function ProjectRoutePage() {
  const { slug } = route.useLoaderData();
  const project = getProject(slug);
  if (!project) return null;
  return <ProjectDetailPage project={project} />;
}
