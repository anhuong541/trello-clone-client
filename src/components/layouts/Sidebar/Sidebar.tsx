"use client";

import {
  MdArrowBackIosNew,
  MdArrowForwardIos,
  MdOutlineGroup,
  MdOutlinePostAdd,
  MdOutlineTextSnippet,
} from "react-icons/md";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

import { handleUserProjectList } from "@/actions/query-actions";
import { reactQueryKeys } from "@/lib/react-query-keys";
import AddProjectPopover from "./AddProjectPopover";
import ProjectItemOption from "./ProjectItemOption";
import useScreenView from "@/hooks/ScreenView";
import { cn } from "@/lib/utils";

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
    <div
      className={cn(
        "flex relative group pr-4 hover:bg-blue-300",
        disableIfOnMemberPage && ProjectSelected && "bg-blue-400 hover:bg-blue-400/70"
      )}
    >
      <Link
        href={`/project/${item.projectId}`}
        className="flex justify-between w-full items-center px-4 py-2 group-hover:text-blue-800 cursor-pointer before:absolute before:top-0 before:left-0 before:bottom-0 before:right-0 group-hover:before:contents-['']"
      >
        <div className="flex items-center gap-2">
          <MdOutlineTextSnippet className="w-5 h-5" />
          <p className="font-medium text-sm">{item.projectName}</p>
        </div>
      </Link>
      <div className="relative z-10 flex">
        <ProjectItemOption
          itemData={item}
          disableIfOnMemberPage={disableIfOnMemberPage}
          ProjectSelected={ProjectSelected}
        />
      </div>
    </div>
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
          <div className="flex flex-col whitespace-nowrap">
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
