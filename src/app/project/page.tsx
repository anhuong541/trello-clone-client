"use client";

import { handleUserInfo } from "@/actions/query-actions";
import Header from "@/components/layouts/Header";
import { Sidebar } from "@/components/layouts/Sidebar";
import { reactQueryKeys } from "@/lib/react-query-keys";
import { Skeleton } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

export default function ProjectPage() {
  const queryData = useQuery({
    queryKey: [reactQueryKeys.userInfo],
    queryFn: handleUserInfo,
  });

  if (queryData.isLoading) {
    return (
      <main className="h-screen w-screen flex flex-col">
        <Skeleton height="60px" />
        <div className="grid grid-cols-10 h-full bg-blue-100"></div>
      </main>
    );
  }

  return (
    <main className="h-screen w-screen flex flex-col">
      <Header userInfo={queryData?.data} />
      <div className="grid grid-cols-10 h-full">
        <Sidebar userId={queryData?.data?.data?.uid} projectId="" />
        <div className="col-span-8 bg-blue-100" />
      </div>
    </main>
  );
}
