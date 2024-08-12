import { handleUserInfo } from "@/actions/query-actions";
import Header from "@/components/layouts/Header";
import Sidebar from "@/components/layouts/Sidebar";
import { cookies } from "next/headers";

export default async function ProjectPage() {
  const data = await handleUserInfo(cookies());
  // TODO: missing a userId update or something to read user and projectId
  // TODO: read info with jwt bla bla
  // TODO: send userId to the server don't let the api read userId

  console.log({ data: data?.data?.uid });

  return (
    <main className="h-screen w-screen flex flex-col">
      <Header />
      <div className="grid grid-cols-10 h-full">
        <Sidebar userId={data?.data?.uid} projectId="" />
      </div>
    </main>
  );
}
