import { handleUserInfo } from "@/lib/react-query/query-actions";
import Header from "@/components/layouts/Header";
import { cookies } from "next/headers";
import { ReactNode } from "react";

export default async function ProjectsLayout({ children }: { children: ReactNode }) {
  const data = await handleUserInfo(cookies());

  return (
    <main className="h-screen w-screen flex flex-col">
      <Header userInfo={data?.data} />
      {children}
    </main>
  );
}
