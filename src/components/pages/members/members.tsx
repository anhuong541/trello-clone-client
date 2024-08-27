"use client";

import {
  handleProjectInfo,
  handleUserProjectList,
  viewProjectMemberAction,
} from "@/actions/query-actions";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
} from "@chakra-ui/react";
import {
  MdOutlineGroupRemove,
  MdOutlineKeyboardDoubleArrowDown,
  MdOutlinePersonAdd,
} from "react-icons/md";
import { Box, Flex, Select } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { ReactNode, useContext, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

import { reactQueryKeys } from "@/lib/react-query-keys";
import { AuthorityType, ProjectUser } from "@/types";
import { UserDataContext } from "@/context/UserInfoContextProvider";
import { AddMemberModal, AlertDelete, ViewMemberInfo } from "./memberActions";
import { ProjectListItem } from "@/components/layouts/Sidebar/Sidebar";
import { Button } from "@/components/common/Button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const showMemberRole = (input: AuthorityType[]) => {
  if (input.includes("Owner")) {
    return "Owner";
  } else if (input.includes("Edit")) {
    return "Edit";
  } else {
    return "View";
  }
};

function SelectProjectMember({ currentProject }: { currentProject: any }) {
  const route = useRouter();

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
    <Popover placement="top-end">
      <PopoverTrigger>
        <Button size="sm" variant="outline" className="flex items-center gap-1 font-semibold">
          <MdOutlineKeyboardDoubleArrowDown className="w-5 h-5" />
          Change Team
        </Button>
      </PopoverTrigger>
      <PopoverContent width={200} className="border !border-gray-200">
        <PopoverArrow className="!bg-blue-100" />
        <PopoverBody>
          {userProjectList.map((project) => {
            return (
              <Box
                key={project.projectId}
                className={cn(
                  "cursor-pointer p-2 hover:bg-gray-100 text-sm whitespace-nowrap text-ellipsis overflow-hidden font-medium",
                  project?.projectId === currentProject?.projectId &&
                    "bg-gray-200 hover:bg-gray-200/80"
                )}
                onClick={() => route.push(`/project/members/${project.projectId}`)}
              >
                {project.projectName}
              </Box>
            );
          })}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default function Members({ projectId }: { projectId: string }) {
  const { userDataStore } = useContext(UserDataContext);

  const queryUserProjectInfo = useQuery({
    queryKey: [reactQueryKeys.projectInfo],
    queryFn: () => handleProjectInfo(projectId),
  });

  const queryProjectMember = useQuery({
    queryKey: [reactQueryKeys.viewProjectMember],
    queryFn: () => viewProjectMemberAction(projectId),
  });

  const projectInfo = queryUserProjectInfo?.data?.data?.data;
  const projectMember = queryProjectMember?.data?.data?.listUser;
  // console.log({ projectMember, projectInfo });

  return (
    <Box className="lg:col-span-8 overflow-x-auto overflow-y-hidden h-full w-full">
      <div className="mx-auto max-w-5xl flex justify-between items-center py-4 px-6">
        <div className="flex items-center gap-2">
          <Image
            src="/default-avatar.webp"
            alt="avatar"
            height={48}
            width={48}
            className="w-12 h-12 object-contain rounded-full"
          />
          <h2 className="font-bold text-xl overflow-hidden whitespace-nowrap">
            {projectInfo?.projectName}
          </h2>
        </div>
        <Flex gap={2} alignItems="center">
          <SelectProjectMember currentProject={projectInfo} />
          <AddMemberModal projectId={projectId}>
            <MdOutlinePersonAdd className="h-5 w-5" /> Add new member
          </AddMemberModal>
        </Flex>
      </div>
      <hr />
      <Box className="flex flex-col mx-auto py-4 px-6" maxWidth={1024}>
        <p className="font-bold pb-4 border-b">Members:</p>
        <Box display="flex" flexDirection="column">
          {(projectMember ?? []).map((member: ProjectUser, index: number) => {
            return (
              <Flex
                justifyContent="space-between"
                alignItems="center"
                key={index}
                className="border-b py-2"
              >
                <ViewMemberInfo member={member}>
                  <Image src="/default-avatar.webp" alt="" width={36} height={36} />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h6 className="font-bold group-hover:underline underline-offset-2">
                        {member.username}
                      </h6>
                      <p className="text-sm text-gray-500">({showMemberRole(member.authority)})</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      @{member.email} - Time created: {dayjs(member.createAt).format("MMM YYYY")}
                    </p>
                  </div>
                </ViewMemberInfo>
                {userDataStore?.uid !== member.uid && (
                  <AlertDelete projectId={projectId} member={member}>
                    <MdOutlineGroupRemove className="h-5 w-5" />
                    Kick out
                  </AlertDelete>
                )}
              </Flex>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
