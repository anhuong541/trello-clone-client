import { onDeleteProject, onEditProject } from "@/actions/query-actions";
import { reactQueryKeys } from "@/lib/react-query-keys";
import * as Popover from "@radix-ui/react-popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MdOutlineClose, MdOutlineMoreHoriz } from "react-icons/md";
import { ProjectListItem } from "./layouts/Sidebar";
import { SubmitHandler, useForm } from "react-hook-form";
import { MouseEvent } from "react";
import { Input } from "./common/Input";

interface ProjectItemOptionProps {
  itemData: ProjectListItem;
}

interface EditProjectInput {
  projectName: string;
  projectDescription: string;
}

export default function ProjectItemOption({
  itemData,
}: ProjectItemOptionProps) {
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
        await userDeleteProjectAction.mutateAsync({
          projectId: itemData.projectId,
          userId: itemData.userId,
        });
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
    <Popover.Root>
      <Popover.Trigger className="h-8 w-8 flex justify-center items-center">
        <MdOutlineMoreHoriz />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="right"
          className="translate-x-5 translate-y-20 z-10 flex flex-col border rounded-md py-2 w-[230px] bg-blue-50 text-gray-700"
        >
          <div className="flex justify-center px-4 relative">
            <h4 className="py-2 font-bold text-sm text-center">
              {itemData.projectName}
            </h4>
            <Popover.Close className="absolute top-0 right-2 hover:bg-blue-100 p-2 rounded-md">
              <MdOutlineClose />
            </Popover.Close>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 px-4"
          >
            <label htmlFor="name-project" className="flex flex-col gap-1">
              <p className="text-xs font-medium">Project Name</p>
              <Input
                {...register("projectName")}
                type="text"
                id="name-project"
              />
            </label>
            <label
              htmlFor="description-project"
              className="flex flex-col gap-1"
            >
              <p className="text-xs font-medium">Project Description</p>
              <Input
                {...register("projectDescription")}
                type="text"
                id="description-project"
              />
            </label>
            <div className="flex justify-between gap-1">
              {listProjectItenOption.map((item, index) => {
                if (item.label === "Edit") {
                  return (
                    <button
                      key={index}
                      className="hover:bg-blue-400 bg-blue-500 text-white active:opacity-60 rounded-md px-4 py-2 w-full font-medium"
                    >
                      {item.label}
                    </button>
                  );
                } else {
                  return (
                    <button
                      key={index}
                      className="hover:bg-red-500 hover:text-white border border-red-500 text-red-500 active:opacity-60 rounded-md px-4 py-2 w-full font-medium"
                      onClick={item.action}
                    >
                      {item.label}
                    </button>
                  );
                }
              })}
            </div>
          </form>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
