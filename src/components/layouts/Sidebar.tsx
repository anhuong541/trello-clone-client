"use client";

import Image from "next/image";
import AddProjectPopover from "../AddProjectPopover";
import { handleUserProjectList } from "@/actions/query-actions";
import { reactQueryKeys } from "@/lib/react-query-keys";
import { useQuery } from "@tanstack/react-query";
import ProjectItemOption from "../ProjectItemOption";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export interface ProjectListItem {
  description: string;
  projectName: string;
  projectId: string;
  createAt: number;
  userId: string;
}

export interface ProjectSelectProps {
  item: ProjectListItem;
}

function ProjectSelect({ item }: ProjectSelectProps) {
  const route = useRouter();

  const onSelectProject = async () => {
    // push to /project/[projectId] in the fulture
    route.push(`/project/${item.projectId}/${item.userId}`);
  };

  return (
    <div className="wrappper relative group">
      <div
        className="flex justify-between w-full items-center px-4 py-2 group-hover:bg-blue-100 cursor-pointer"
        onClick={onSelectProject}
      >
        <p className="font-medium">{item.projectName}</p>
      </div>
      <div className="absolute top-[50%] -translate-y-1/2 right-5 group-hover:bg-blue-100 hover:!bg-blue-300 rounded-md">
        <ProjectItemOption itemData={item} />
      </div>
    </div>
  );
}

export default function Sidebar({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}) {
  const queryUserProjectList = useQuery({
    queryKey: [reactQueryKeys.projectList],
    queryFn: async () => await handleUserProjectList(userId),
  });

  const userProjectList: ProjectListItem[] = useMemo(() => {
    return (queryUserProjectList && queryUserProjectList.data?.data.data) ?? [];
  }, [queryUserProjectList]);

  const projectName = useMemo(() => {
    return userProjectList.find((item) => item.projectId === projectId)
      ?.projectName;
  }, [projectId, userProjectList]);

  return (
    <div className="col-span-2 h-full flex flex-col bg-blue-200">
      <div className="flex items-center gap-2 px-4 py-2">
        <Image
          src="/default-avatar.webp"
          alt="avatar"
          height={40}
          width={40}
          className="w-8 h-8 object-contain rounded-full"
        />
        <h2 className="font-medium text-xl">{projectName}</h2>
      </div>
      <div className="flex flex-col gap-2 h-full py-2">
        <div className="flex items-center justify-between px-4">
          <h3 className="font-semibold">Project List</h3>
          <AddProjectPopover userId={userId} />
        </div>
        <div className="flex flex-col">
          {userProjectList.map((item: ProjectListItem, index: number) => {
            return <ProjectSelect item={item} key={index} />;
          })}
        </div>
      </div>
    </div>
  );
}
