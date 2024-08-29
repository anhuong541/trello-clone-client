import { MouseEvent, ReactNode } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  useDisclosure,
} from "@chakra-ui/react";
import { reactQueryKeys } from "@/lib/react-query-keys";
import { onDeleteProject, onEditProject } from "@/actions/query-actions";
import { ProjectListItem } from "./Sidebar";
import { Input, Textarea } from "@chakra-ui/react";
import { Button } from "@/components/common/Button";

interface ProjectItemOptionProps {
  itemData: ProjectListItem;
  children: ReactNode;
}

interface EditProjectInput {
  projectName: string;
  projectDescription: string;
}

export default function ProjectItemOption({ itemData, children }: ProjectItemOptionProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const { register, handleSubmit, watch, reset } = useForm<EditProjectInput>();

  const userEditProjectAction = useMutation({
    mutationFn: onEditProject,
    mutationKey: [reactQueryKeys.editProject],
  });
  const userDeleteProjectAction = useMutation({
    mutationFn: onDeleteProject,
    mutationKey: [reactQueryKeys.deleteProject],
  });

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
          queryKey: [reactQueryKeys.projectList],
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
      queryKey: [reactQueryKeys.projectList],
    });
    reset();
  };

  return (
    <Popover placement="right-start" isOpen={isOpen} onOpen={onOpen} onClose={onClose} autoFocus>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent display="flex" flexDirection="column" className="py-4">
        <PopoverArrow />
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
            />
          </label>
          <label htmlFor="description-project" className="flex flex-col gap-1">
            <p className="text-xs font-medium">Project Description</p>
            <Textarea
              {...register("projectDescription")}
              id="description-project"
              backgroundColor="white"
              placeholder="Edit description"
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
                  <Button
                    key={index}
                    className="w-full"
                    variant="destruction"
                    onClick={item.action}
                  >
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
