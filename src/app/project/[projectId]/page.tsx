import { cookies } from "next/headers";
import { handleUserInfo } from "@/actions/query-actions";
import Header from "@/components/layouts/Header";
import Project from "@/components/pages/project";

export default async function ProjectPage({ params }: { params: { projectId: string } }) {
  const data = await handleUserInfo(cookies());

  return (
    <main className="h-screen w-screen flex flex-col">
      <Header userInfo={data?.data} />
      <Project projectId={params.projectId} />
    </main>
  );
}
