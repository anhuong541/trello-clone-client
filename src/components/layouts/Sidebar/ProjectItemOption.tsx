import { MouseEvent, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MdOutlineClose, MdOutlineMoreHoriz } from "react-icons/md";
import * as Popover from "@radix-ui/react-popover";
import { reactQueryKeys } from "@/lib/react-query-keys";
import { onDeleteProject, onEditProject } from "@/actions/query-actions";
import { ProjectListItem } from "./Sidebar";
import { Input, Textarea } from "@chakra-ui/react";
import { Button } from "@/components/common/Button";

interface ProjectItemOptionProps {
  itemData: ProjectListItem;
}

interface EditProjectInput {
  projectName: string;
  projectDescription: string;
}

export default function ProjectItemOption({ itemData }: ProjectItemOptionProps) {
  const [openPop, setOpenPop] = useState(false);
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
        setOpenPop(false);
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
    setOpenPop(false);
    reset();
  };

  return (
    <Popover.Root open={openPop}>
      <Popover.Trigger
        className="h-8 w-8 flex justify-center items-center hover:text-white"
        onClick={() => setOpenPop((prev) => !prev)}
      >
        <MdOutlineMoreHoriz />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="right"
          className="translate-x-5 translate-y-24 z-10 flex flex-col border rounded-md py-2 bg-blue-50 text-gray-700"
          onInteractOutside={() => setOpenPop(false)}
        >
          <div className="flex justify-center px-4 relative">
            <h4 className="py-2 font-bold text-sm text-center">{itemData.projectName}</h4>
            <Popover.Close
              className="absolute top-[2px] right-2 hover:bg-blue-100 p-2 rounded-md"
              onClick={() => setOpenPop(false)}
            >
              <MdOutlineClose />
            </Popover.Close>
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
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
