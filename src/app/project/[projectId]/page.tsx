import { handleUserInfo } from "@/actions/query-actions";
import KanbanBoard from "@/components/KanbanBoard";
import Header from "@/components/layouts/Header";
import Sidebar from "@/components/layouts/Sidebar";
import { cookies } from "next/headers";
export default async function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const data = await handleUserInfo(cookies());

  return (
    <main className="h-screen w-screen flex flex-col">
      <Header />
      <div className="grid grid-cols-10 h-full">
        <Sidebar projectId={params.projectId} userId={data?.data?.uid} />
        <KanbanBoard projectId={params.projectId} userId={data?.data?.uid} />
      </div>
    </main>
  );
}
