"use client";

import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import AddProjectPopover from "./AddProjectPopover";
import { handleUserProjectList } from "@/actions/query-actions";
import { reactQueryKeys } from "@/lib/react-query-keys";
import ProjectItemOption from "./ProjectItemOption";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@chakra-ui/react";
import {
  MdArrowBackIosNew,
  MdArrowForwardIos,
  MdOutlineGroup,
  MdOutlineMoreHoriz,
  MdOutlinePostAdd,
  MdOutlineTextSnippet,
} from "react-icons/md";
import useScreenView from "@/hooks/ScreenView";
import Link from "next/link";

export interface ProjectListItem {
  description: string;
  projectName: string;
  projectId: string;
  createAt: number;
  dueTime: number;
}

export interface ProjectSelectProps {
  item: ProjectListItem;
  ProjectSelected: boolean;
}

function ProjectSelect({ item, ProjectSelected }: ProjectSelectProps) {
  const pathName = usePathname();
  const disableIfOnMemberPage = !pathName.split("/").includes("members");

  return (
    <Link
      href={`/project/${item.projectId}`}
      className={cn(
        "flex justify-between w-full items-center px-4 py-2 hover:bg-blue-100 cursor-pointer",
        disableIfOnMemberPage &&
          ProjectSelected &&
          "bg-blue-400 text-white hover:bg-blue-300 hover:text-blue-800"
      )}
    >
      <div className="flex items-center gap-2">
        <MdOutlineTextSnippet className="w-5 h-5" />
        <p className="font-medium text-sm">{item.projectName}</p>
      </div>
      <ProjectItemOption itemData={item}>
        <button
          className={cn(
            "h-8 w-8 flex justify-center items-center rounded-md hover:bg-blue-200",
            disableIfOnMemberPage && ProjectSelected && "bg-blue-400 text-white hover:text-blue-800"
          )}
        >
          <MdOutlineMoreHoriz className="w-5 h-5" />
        </button>
      </ProjectItemOption>
    </Link>
  );
}

export default function Sidebar({ projectId }: { projectId: string }) {
  const { screenView } = useScreenView();
  const [openSidebar, setOpenSidebar] = useState(true);

  useEffect(() => {
    if (screenView) {
      setOpenSidebar(Number(screenView) > 1024);
    }
  }, [screenView]);

  const queryUserProjectList = useQuery({
    queryKey: [reactQueryKeys.projectList],
    queryFn: handleUserProjectList,
  });

  const userProjectList: ProjectListItem[] = useMemo(() => {
    const data: ProjectListItem[] =
      (queryUserProjectList && queryUserProjectList.data?.data.data) ?? [];

    return data?.sort((a, b) => b?.dueTime - a?.dueTime);
  }, [queryUserProjectList]);

  console.log({ queryUserProjectList: queryUserProjectList.data?.data.data });

  const projectName = useMemo(() => {
    return userProjectList?.find((item) => item?.projectId === projectId)?.projectName ?? "";
  }, [projectId, userProjectList]);

  return (
    <div
      className={cn(
        openSidebar ? "max-lg:w-[300px] max-lg:sm:w-[400px]" : "w-[16px]",
        "relative col-span-2 lg:flex flex-shrink-0 flex-col bg-blue-200 transition-all duration-300"
      )}
    >
      {openSidebar && (
        <div className="flex justify-between items-center gap-2 px-4 py-2">
          <div className="flex items-center gap-2">
            {projectId !== "" ? (
              <Image
                src="/default-avatar.webp"
                alt="avatar"
                height={40}
                width={40}
                className="w-8 h-8 object-contain rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full" />
            )}

            <h2 className="font-bold text-lg overflow-hidden whitespace-nowrap">{projectName}</h2>
          </div>
          {Number(screenView) < 1024 && (
            <button
              className="flex justify-center items-center bg-blue-200 hover:bg-blue-100 text-blue-900 p-3 rounded-md"
              onClick={() => setOpenSidebar(false)}
            >
              <MdArrowBackIosNew className="w-3 h-3 font-medium" />
            </button>
          )}
        </div>
      )}

      {!openSidebar && (
        <button
          className="absolute flex justify-center items-center -right-[14px] top-[12px] z-50 bg-blue-500 text-white p-2 rounded-full"
          onClick={() => setOpenSidebar(true)}
        >
          <MdArrowForwardIos className="w-4 h-4 font-medium rounded-full" />
        </button>
      )}

      {openSidebar && (
        <div className="flex flex-col gap-2 h-[calc(100%-55px)] py-2">
          {projectId !== "" && (
            <Link
              href={`/project/members/${projectId}`}
              className="px-4 py-2 font-medium text-sm hover:bg-blue-300/60 flex items-center gap-2 bg-blue-300"
            >
              <MdOutlineGroup className="w-5 h-5" /> Members
            </Link>
          )}

          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <MdOutlinePostAdd className="w-5 h-5" />
              <h3 className="font-semibold text-sm overflow-hidden whitespace-nowrap">
                Your Projects
              </h3>
            </div>
            <AddProjectPopover />
          </div>
          <div className="flex flex-col overflow-hidden whitespace-nowrap">
            {queryUserProjectList.isLoading ? (
              <Skeleton height="60px" />
            ) : (
              userProjectList.map((item: ProjectListItem, index: number) => {
                return (
                  <ProjectSelect
                    item={item}
                    ProjectSelected={projectId === item.projectId}
                    key={index}
                  />
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
