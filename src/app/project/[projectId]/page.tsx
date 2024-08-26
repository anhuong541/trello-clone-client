import Project from "@/components/pages/project/project";

export default async function ProjectPage({ params }: { params: { projectId: string } }) {
  return <Project projectId={params.projectId} />;
}
