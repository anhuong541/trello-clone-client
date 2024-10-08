import { MouseEvent } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { Popover, PopoverTrigger, PopoverContent, PopoverArrow, useDisclosure } from "@chakra-ui/react";
import { queryKeys } from "@/lib/react-query/query-keys";
import { OnDeleteProject, OnEditProject } from "@/lib/react-query/query-actions";
import { ProjectListItem } from "./Sidebar";
import { Input, Textarea } from "@chakra-ui/react";
import { Button } from "@/components/common/Button";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { cn } from "@/lib/utils";

interface ProjectItemOptionProps {
  itemData: ProjectListItem;
  disableIfOnMemberPage: boolean;
  ProjectSelected: boolean;
}

interface EditProjectInput {
  projectName: string;
  projectDescription: string;
}

export default function ProjectItemOption({
  itemData,
  disableIfOnMemberPage,
  ProjectSelected,
}: ProjectItemOptionProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const { register, handleSubmit, watch, reset } = useForm<EditProjectInput>();

  const userEditProjectAction = OnEditProject();
  const userDeleteProjectAction = OnDeleteProject();

  const listProjectItenOption = [
    {
      label: "Edit",
      // action: () => {}, // already trigger onSubmit
    },
    {
      label: "Delete",
      action: async (e: MouseEvent) => {
        e.preventDefault();
        onClose();
        await userDeleteProjectAction.mutateAsync(itemData.projectId);
        queryClient.refetchQueries({
          queryKey: [queryKeys.projectList],
        });
      },
    },
  ];

  const onSubmit: SubmitHandler<EditProjectInput> = async (data) => {
    let dataChange = {};
    if (data.projectName === "") {
      console.log("trigger toast!!!");
      return;
    }

    if (data.projectDescription !== "") {
      dataChange = {
        description: data.projectDescription,
      };
    }
    if (data.projectName !== "") {
      dataChange = {
        ...dataChange,
        projectName: data.projectName,
      };
    }

    await userEditProjectAction.mutateAsync({
      ...itemData,
      ...dataChange,
    });
    queryClient.refetchQueries({
      queryKey: [queryKeys.projectList],
    });
    reset();
  };

  return (
    <Popover placement="right-start" isOpen={isOpen} onOpen={onOpen} onClose={onClose} autoFocus>
      <PopoverTrigger>
        <button
          className={cn(
            "h-9 w-9 flex justify-center items-center m-auto hover:text-white hover:bg-blue-400/60 dark:hover:bg-gray-600/60"
          )}
        >
          <MdOutlineMoreHoriz className="w-5 h-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent display="flex" flexDirection="column" className="py-4">
        <PopoverArrow />
        {/* <PopoverCloseButton /> */}
        <div className="flex justify-center px-4 relative">
          <h4 className="py-2 font-bold text-sm text-center">{itemData.projectName}</h4>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 px-4">
          <label htmlFor="name-project" className="flex flex-col gap-1">
            <p className="text-xs font-medium">Project Name</p>
            <Input
              {...register("projectName")}
              type="text"
              id="name-project"
              backgroundColor="white"
              placeholder="Edit name"
              className="dark:bg-gray-600"
            />
          </label>
          <label htmlFor="description-project" className="flex flex-col gap-1">
            <p className="text-xs font-medium">Project Description</p>
            <Textarea
              {...register("projectDescription")}
              id="description-project"
              backgroundColor="white"
              placeholder="Edit description"
              className="dark:bg-gray-600"
            />
          </label>
          <div className="flex justify-between gap-1">
            {listProjectItenOption.map((item, index) => {
              if (item.label === "Edit") {
                return (
                  <Button key={index} className="w-full">
                    {item.label}
                  </Button>
                );
              } else {
                return (
                  <Button key={index} className="w-full" variant="destruction" onClick={item.action}>
                    {item.label}
                  </Button>
                );
              }
            })}
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
