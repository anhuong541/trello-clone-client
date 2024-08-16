import { cookies } from "next/headers";
import { handleUserInfo } from "@/actions/query-actions";
import KanbanBoard from "@/components/KanbanTable/KanbanBoard";
import Header from "@/components/layouts/Header";
import { Sidebar } from "@/components/layouts/Sidebar";

export function generateStaticParams() {
  const pages = [
    "130e0aa7-0dee-4a64-890f-82691418e3b3",
    "502ee38d-8994-4157-b36a-e773cd053787",
  ];
  return pages.map((id) => ({ projectId: id }));
}

export default async function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  // const data = await handleUserInfo(cookies());

  const data = {
    data: {
      data: {
        uid: "518df0473a0c6ad7f1375062fc6dfe54333",
      },
    },
  };

  return (
    <main className="h-screen w-screen flex flex-col">
      <Header userInfo={data?.data} />
      <div className="lg:grid lg:grid-cols-10 flex h-full">
        <Sidebar projectId={params.projectId} userId={data?.data?.data.uid} />
        <KanbanBoard projectId={params.projectId} />
      </div>
    </main>
  );
}
