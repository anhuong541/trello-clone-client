"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import AddProjectPopover from "../AddProjectPopover";
import { handleUserProjectList } from "@/actions/query-actions";
import { reactQueryKeys } from "@/lib/react-query-keys";
import ProjectItemOption from "../ProjectItemOption";
import { useContext, useMemo } from "react";
import { cn } from "@/lib/utils";
import { KanbanDataContext } from "@/context/kanbanTable";

export interface ProjectListItem {
  description: string;
  projectName: string;
  projectId: string;
  createAt: number;
  dueTime: number;
}

export interface ProjectSelectProps {
  item: ProjectListItem;
}

function ProjectSelect({ item }: ProjectSelectProps) {
  const route = useRouter();
  const params = useParams();
  const ProjectSelected = params.projectId === item.projectId;

  const onSelectProject = async () => {
    route.push(`/project/${item.projectId}`);
  };

  return (
    <div className="wrappper relative group">
      <div
        className={cn(
          "flex justify-between w-full items-center px-4 py-2 group-hover:bg-blue-100 cursor-pointer",
          ProjectSelected &&
            "bg-blue-400 text-white group-hover:bg-blue-300 group-hover:text-blue-800"
        )}
        onClick={onSelectProject}
      >
        <p className="font-medium">{item.projectName}</p>
      </div>
      <div
        className={cn(
          "absolute top-[50%] -translate-y-1/2 right-5 group-hover:bg-blue-100 hover:!bg-blue-300 rounded-md",
          ProjectSelected &&
            "bg-blue-400 text-white group-hover:bg-blue-300 group-hover:text-blue-800 hover:!bg-blue-400"
        )}
      >
        <ProjectItemOption itemData={item} />
      </div>
    </div>
  );
}

export default function Sidebar({
  userId,
  projectId,
}: {
  userId: string;
  projectId: string;
}) {
  const queryUserProjectList = useQuery({
    queryKey: [reactQueryKeys.projectList],
    queryFn: handleUserProjectList,
  });

  const userProjectList: ProjectListItem[] = useMemo(() => {
    const data: ProjectListItem[] =
      (queryUserProjectList && queryUserProjectList.data?.data.data) ?? [];

    const formatDataUserProjectList = data.sort(
      (a, b) => b?.dueTime - a?.dueTime
    );

    return formatDataUserProjectList;
  }, [queryUserProjectList]);

  const projectName = useMemo(() => {
    return (
      userProjectList.find((item) => item?.projectId === projectId)
        ?.projectName ?? []
    );
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
