"use client";

import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
} from "@chakra-ui/react";
import { Skeleton, SkeletonCircle } from "@chakra-ui/react";
import {
  MdOutlineGroupRemove,
  MdOutlineKeyboardDoubleArrowDown,
  MdOutlinePersonAdd,
} from "react-icons/md";
import { Box, Flex } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useContext, useMemo } from "react";
import dayjs from "dayjs";

import {
  handleProjectInfo,
  handleUserProjectList,
  viewProjectMemberAction,
} from "@/actions/query-actions";
import { AddMemberModal, AlertDelete, ViewMemberInfo } from "./memberActions";
import { UserDataContext } from "@/context/UserInfoContextProvider";
import { ProjectListItem } from "@/components/layouts/Sidebar/Sidebar";
import { reactQueryKeys } from "@/lib/react-query-keys";
import { AuthorityType, ProjectUser } from "@/types";
import { Button } from "@/components/common/Button";
import useScreenView from "@/hooks/ScreenView";
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
  const { screenView } = useScreenView();
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
    <Popover placement={screenView ? (Number(screenView) < 360 ? "top-end" : "top") : "top-end"}>
      <PopoverTrigger>
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-1 font-semibold"
          disabled={queryUserProjectList.isLoading}
        >
          <MdOutlineKeyboardDoubleArrowDown className="w-5 h-5" />
          Change Team
        </Button>
      </PopoverTrigger>
      <PopoverContent width={200} className="border !border-gray-200 max-sm:!w-[95vw]">
        <PopoverArrow className="dark:hidden" />
        <PopoverBody className="!py-4">
          {userProjectList.map((project) => {
            return (
              <Box
                key={project.projectId}
                className={cn(
                  "cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-600/80 text-sm whitespace-nowrap text-ellipsis overflow-hidden font-medium",
                  project?.projectId === currentProject?.projectId &&
                    "bg-gray-200 dark:bg-gray-600 hover:bg-gray-200/80"
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

  const isOwner = queryProjectMember?.data?.data?.listUser
    .find((item: any) => item.uid === userDataStore?.uid)
    .authority.includes("Owner");

  return (
    <Box className="lg:col-span-8 overflow-x-auto overflow-y-hidden h-full w-full">
      <div className="mx-auto max-w-5xl flex sm:justify-between sm:items-center sm:flex-row flex-col sm:gap-0 gap-4 py-4 px-6">
        <div className="flex items-center gap-2">
          {queryProjectMember.isLoading ? (
            <SkeletonCircle size="12" />
          ) : (
            <Image
              src="/default-avatar.webp"
              alt="avatar"
              height={48}
              width={48}
              className="w-12 h-12 object-contain rounded-full"
            />
          )}

          {queryProjectMember.isLoading ? (
            <Skeleton height="30px" width="100px" borderRadius={4} />
          ) : (
            <h2 className="font-bold text-xl overflow-hidden whitespace-nowrap">
              {projectInfo?.projectName}
            </h2>
          )}
        </div>
        <Flex gap={2} className="sm:flex-row flex-col sm:items-center">
          {isOwner && (
            <AddMemberModal projectId={projectId} isDisable={queryProjectMember.isLoading}>
              <MdOutlinePersonAdd className="h-5 w-5" /> Add new member
            </AddMemberModal>
          )}
          <SelectProjectMember currentProject={projectInfo} />
        </Flex>
      </div>
      <hr />
      <Box className="flex flex-col mx-auto py-4 px-6" maxWidth={1024}>
        <p className={cn(!queryProjectMember.isLoading && "border-b", "font-bold pb-4")}>
          Members:
        </p>
        {queryProjectMember.isLoading ? (
          <Box display="flex" flexDirection="column" gap={1}>
            <SkeletonMemberList height="40px" />
          </Box>
        ) : (
          <Box display="flex" flexDirection="column">
            {(projectMember ?? []).map((member: ProjectUser, index: number) => {
              return (
                <Flex
                  key={index}
                  className="border-b py-2 sm:flex-row flex-col sm:items-center sm:justify-between gap-4"
                >
                  <ViewMemberInfo member={member}>
                    <Image
                      src="/default-avatar.webp"
                      alt=""
                      width={36}
                      height={36}
                      className="sm:w-9 sm:h-9 h-10 w-10 object-contain flex-shrink-0 rounded-full"
                    />
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <h6 className="font-bold group-hover:underline underline-offset-2">
                          {member.username}
                        </h6>
                        <p className="text-sm text-gray-500">
                          ({showMemberRole(member.authority)})
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {member.email} - Time created: {dayjs(member.createAt).format("MMM YYYY")}
                      </p>
                    </div>
                  </ViewMemberInfo>
                  {userDataStore?.uid !== member.uid && isOwner && (
                    <Flex gap={3} alignItems="center" justifyContent="end" className="text-black">
                      <AlertDelete projectId={projectId} member={member}>
                        <MdOutlineGroupRemove className="h-5 w-5" />
                        Kick out
                      </AlertDelete>
                    </Flex>
                  )}
                </Flex>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}

function SkeletonMemberList({ height }: { height: string }) {
  return ["", "", "", "", "", ""].map((_: string, index: number) => {
    return <Skeleton height={height} borderRadius={4} key={index} />;
  });
}
