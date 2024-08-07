"use client";

import Image from "next/image";
import AddProjectPopover from "../AddProjectPopover";
import { handleUserProjectList } from "@/actions/query-actions";
import { reactQueryKeys } from "@/lib/react-query-keys";
import { useQuery } from "@tanstack/react-query";
import ProjectItemOption from "../ProjectItemOption";
import { useRouter } from "next/navigation";
import { projectStore } from "@/lib/stores";
import { useEffect } from "react";

export interface ProjectListItem {
  description: string;
  projectName: string;
  projectId: string;
  createAt: number;
  userId: string;
}

export interface ProjectSelectProps {
  item: ProjectListItem;
  updateProjectName: (value: string) => void;
  updateProjectID: (value: string) => void;
}

function ProjectSelect({
  item,
  updateProjectName,
  updateProjectID,
}: ProjectSelectProps) {
  const route = useRouter();
  const onSelectProject = async () => {
    console.log("object: ", item.projectName);
    // push to /project/[projectId] in the fulture
    // route.push(`/project/${item.projectId}`);
    updateProjectID(item.projectId);
    updateProjectName(item.projectName);
  };

  return (
    <div className="wrappper relative group">
      <div
        className="flex justify-between w-full items-center px-4 py-2 group-hover:bg-blue-100 cursor-pointer"
        onClick={onSelectProject}
      >
        <p className="text-sm font-medium">{item.projectName}</p>
      </div>
      <div className="absolute top-[50%] -translate-y-1/2 right-4 group-hover:bg-blue-100 hover:!bg-blue-300 rounded-md">
        <ProjectItemOption itemData={item} />
      </div>
    </div>
  );
}

export default function Sidebar({ userId }: { userId: string }) {
  const { projectName, updateProjectName, updateProjectID } = projectStore();
  const queryUserProjectList = useQuery({
    queryKey: [reactQueryKeys.projectList],
    queryFn: async () => await handleUserProjectList(userId),
  });

  const userProjectList: ProjectListItem[] =
    (queryUserProjectList && queryUserProjectList.data?.data.data) ?? [];

  return (
    <div className="col-span-2 h-full flex flex-col bg-blue-200">
      <div className="flex items-center gap-2 p-4 border-b">
        <Image
          src="/default-avatar.webp"
          alt="avatar"
          height={40}
          width={40}
          className="w-10 h-10 object-contain rounded-full"
        />
        <h2 className="font-medium text-xl">{projectName}</h2>
      </div>
      <div className="flex flex-col gap-2 h-full py-2">
        <div className="flex items-center justify-between px-4">
          <h3>Project List</h3>
          <AddProjectPopover userId={userId} />
        </div>
        <div className="flex flex-col">
          {/* {userProjectList.map((item, index) => {
            return <ProjectSelect item={item} key={index} />;
          })} */}
          {userProjectList.map((item: ProjectListItem, index: number) => {
            return (
              <ProjectSelect
                item={item}
                key={index}
                updateProjectID={updateProjectID}
                updateProjectName={updateProjectName}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
