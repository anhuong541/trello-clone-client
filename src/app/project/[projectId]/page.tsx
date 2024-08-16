import { cookies } from "next/headers";
import { handleUserInfo } from "@/actions/query-actions";
import KanbanBoard from "@/components/KanbanTable/KanbanBoard";
import Header from "@/components/layouts/Header";
import { Sidebar } from "@/components/layouts/Sidebar";

export default async function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const data = await handleUserInfo(cookies());

  return (
    <main className="h-screen w-screen flex flex-col">
      <Header userInfo={data?.data} />
      <div className="lg:grid lg:grid-cols-10 flex h-full">
        <Sidebar projectId={params.projectId} userId={data?.data.uid} />
        <KanbanBoard projectId={params.projectId} />
      </div>
    </main>
  );
}
