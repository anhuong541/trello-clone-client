import { handleUserInfo } from "@/actions/query-actions";
import Header from "@/components/layouts/Header";
import Sidebar from "@/components/layouts/Sidebar";
import { cookies } from "next/headers";

export default async function ProjectPage() {
  const data = await handleUserInfo(cookies());

  return (
    <main className="h-screen w-screen flex flex-col">
      <Header userInfo={data} />
      <div className="grid grid-cols-10 h-full">
        <Sidebar userId={data?.data?.uid} projectId="" />
        <div className="col-span-8 bg-blue-100" />
      </div>
    </main>
  );
}
