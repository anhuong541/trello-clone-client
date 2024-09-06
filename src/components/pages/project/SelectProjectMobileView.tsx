"use client";

import { handleUserProjectList } from "@/actions/query-actions";
import { ProjectListItem } from "@/components/layouts/Sidebar/Sidebar";
import { reactQueryKeys } from "@/lib/react-query-keys";
import { Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useMemo } from "react";

export default function SelectProjectMobileView() {
  const queryUserProjectList = useQuery({
    queryKey: [reactQueryKeys.projectList],
    queryFn: handleUserProjectList,
  });

  const userProjectList: ProjectListItem[] = useMemo(() => {
    const data: ProjectListItem[] =
      (queryUserProjectList && queryUserProjectList.data?.data.data) ?? [];

    const formatDataUserProjectList = data.sort((a, b) => b?.dueTime - a?.dueTime);

    return formatDataUserProjectList;
  }, [queryUserProjectList]);

  return (
    <div className="col-span-8 bg-blue-100 dark:bg-gray-500 pt-4 h-full lg:hidden">
      <div className="flex flex-col">
        <Text className="px-4" fontWeight={700}>
          Your projects
        </Text>
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 px-4 py-2">
          {userProjectList.map((item) => {
            return (
              <Link
                href={`/project/${item.projectId}`}
                key={item.projectId}
                className="bg-white dark:bg-gray-700 flex flex-col gap-2 p-4 rounded-md"
              >
                <Text fontSize="lg" fontWeight={700}>
                  {item.projectName}
                </Text>
                <Text color="gray">{item.description !== "" ? item.description : "..."}</Text>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
