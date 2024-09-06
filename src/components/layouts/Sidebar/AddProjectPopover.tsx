"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { MdAdd } from "react-icons/md";

import { onCreateProject } from "@/actions/query-actions";
import { reactQueryKeys } from "@/lib/react-query-keys";
import { toast } from "react-toastify";
import { Input, Textarea } from "@chakra-ui/react";
import { Button } from "@/components/common/Button";

interface AddProjectInput {
  projectName: string;
  projectDescription: string;
}

export default function AddProjectPopover() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const route = useRouter();
  const queryClient = useQueryClient();
  const { register, handleSubmit, watch, reset } = useForm<AddProjectInput>();

  const addProjectAction = useMutation({
    mutationFn: onCreateProject,
    mutationKey: [reactQueryKeys.addProject],
  });

  const onSubmit: SubmitHandler<AddProjectInput> = async (data) => {
    if (data.projectName === "") {
      toast.warning("missing project name");
      return;
    }

    const res = await addProjectAction.mutateAsync({
      description: data.projectDescription,
      projectName: data.projectName,
      projectId: "",
      createAt: Date.now(),
    });

    if (res?.status) {
      toast.success("Create project successfull");
      queryClient.refetchQueries({
        queryKey: [reactQueryKeys.projectList],
      });
      route.push(`/project/${res?.data?.projectId}`);
      onClose();
      reset();
    }
  };

  return (
    <Popover placement="right-start" isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>
        <button className="h-9 w-9 rounded-md bg-blue-400 dark:bg-gray-700 flex justify-center items-center text-white font-medium">
          <MdAdd className="w-5 h-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-4">
        <PopoverArrow />
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <label htmlFor="name-project" className="flex flex-col gap-1">
              <p className="text-xs font-medium">Project Name</p>
              <Input
                {...register("projectName")}
                type="text"
                id="name-project"
                backgroundColor="white"
                placeholder="Project name"
                className="dark:bg-gray-600"
              />
            </label>
            <label htmlFor="description-project" className="flex flex-col gap-1">
              <p className="text-xs font-medium">Description</p>
              <Textarea
                {...register("projectDescription")}
                id="description-project"
                backgroundColor="white"
                placeholder="Project description"
                className="dark:bg-gray-600"
              />
            </label>
          </div>
          <Button type="submit">Add Project</Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
