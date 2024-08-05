"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import * as Popover from "@radix-ui/react-popover";
import { MdAdd } from "react-icons/md";

import { Button } from "./common/Button";
import { Input } from "./common/Input";
import { onCreateNewProject } from "@/actions/firebase-actions";

interface AddProjectInput {
  nameProject: string;
}

export default function AddProjectPopover() {
  const { register, handleSubmit, watch, reset } = useForm<AddProjectInput>();

  const onSubmit: SubmitHandler<AddProjectInput> = async (data) => {
    if (data.nameProject === "") {
      console.log("trigger Toast");
      return;
    }

    await onCreateNewProject(
      "ZVkX4pMMnEVIFbOXKydEZnu1bIt1",
      data.nameProject
    ).then((res) => reset());
  };

  return (
    <Popover.Root>
      <Popover.Trigger>
        <div className="h-10 w-10 rounded-md bg-blue-400 flex justify-center items-center text-white font-medium">
          <MdAdd className="w-6 h-6" />
        </div>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="right"
          className="translate-x-5 flex border rounded-md p-4"
        >
          <form
            className="flex flex-col gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <label htmlFor="name-project" className="flex flex-col gap-1">
              <p className="text-xs font-medium">Your Project Name</p>
              <Input
                {...register("nameProject")}
                type="text"
                id="name-project"
              />
            </label>
            <Button type="submit">Add Project</Button>
          </form>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
