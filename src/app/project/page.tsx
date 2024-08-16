// "use client";

import { handleUserInfo } from "@/actions/query-actions";
import Header from "@/components/layouts/Header";
import { Sidebar } from "@/components/layouts/Sidebar";
import { reactQueryKeys } from "@/lib/react-query-keys";
import { Skeleton } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { cookies } from "next/headers";

export default async function ProjectPage() {
  const data = await handleUserInfo(cookies());
  // const queryData = useQuery({
  //   queryKey: [reactQueryKeys.userInfo],
  //   queryFn: handleUserInfo,
  // });

  // if (queryData.isLoading) {
  //   return (
  //     <main className="h-screen w-screen flex flex-col">
  //       <Skeleton height="60px" />
  //       <div className="grid grid-cols-10 h-full bg-blue-100"></div>
  //     </main>
  //   );
  // }

  return (
    <main className="h-screen w-screen flex flex-col">
      <Header userInfo={data?.data} />
      <div className="grid grid-cols-10 h-full">
        <Sidebar userId={data?.data?.data?.uid} projectId="" />
        <div className="col-span-8 bg-blue-100" />
      </div>
    </main>
  );
}
