"use client";

import { handleProjectInfo } from "@/actions/query-actions";
import { Button } from "@/components/common/Button";
import { useQuery } from "@tanstack/react-query";
import { Box } from "@chakra-ui/react";
import Image from "next/image";

import { reactQueryKeys } from "@/lib/react-query-keys";

export default function Members({ projectId }: { projectId: string }) {
  const queryUserProjectInfo = useQuery({
    queryKey: [reactQueryKeys.projectInfo],
    queryFn: () => handleProjectInfo(projectId),
  });

  const projectInfo = queryUserProjectInfo?.data && queryUserProjectInfo?.data?.data?.data;

  console.log({ projectInfo });

  return (
    <Box className="lg:col-span-8 overflow-x-auto overflow-y-hidden h-full w-full">
      <div className="mx-auto max-w-5xl flex justify-between items-center p-6">
        <div className="flex items-center gap-2">
          <Image
            src="/default-avatar.webp"
            alt="avatar"
            height={48}
            width={48}
            className="w-12 h-12 object-contain rounded-full"
          />
          <h2 className="font-bold text-xl overflow-hidden whitespace-nowrap">
            {projectInfo.projectName}
          </h2>
        </div>
        <Button size="sm">Add new member</Button>
      </div>
      <hr />
      <div></div>
    </Box>
  );
}
