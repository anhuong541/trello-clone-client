import { onChangeTaskState } from "@/actions/query-actions";
import { reactQueryKeys } from "@/lib/react-query-keys";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdOutlineDescription } from "react-icons/md";
import { useState } from "react";
import { Button, useDisclosure, Flex, Text, Textarea } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { TaskItem } from "@/types";

function TaskDescription({ data }: { data: TaskItem }) {
  const { register, handleSubmit, watch, reset } = useForm<{
    taskDescription: string;
  }>();
  const [openEdit, setOpenEdit] = useState(false);
  const descriptionIsEmpty = data?.description?.length === 0;

  const onUserEdit = useMutation({
    mutationFn: onChangeTaskState,
    mutationKey: [reactQueryKeys.updateTask],
  });

  const onSubmit: SubmitHandler<{
    taskDescription: string;
  }> = async (data) => {
    console.log("data => ", data);
    // await onUserEdit.mutateAsync({
    //   ...data,
    //   description: "",
    // });
    // setOpenEdit(false);
    reset();
  };

  return (
    <Flex flexDirection={"column"} gap={2}>
      <Flex gap={4} justifyContent="space-between" alignItems="center">
        <Flex gap={2}>
          <MdOutlineDescription className="w-6 h-6" />
          <Text fontWeight={600}>Description</Text>
        </Flex>
        {!openEdit && !descriptionIsEmpty && (
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => setOpenEdit(true)}
          >
            Edit
          </Button>
        )}
      </Flex>
      {!openEdit && !descriptionIsEmpty && data.description}
      {(openEdit || descriptionIsEmpty) && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex flexDirection={"column"} gap={2}>
            <Textarea
              defaultValue={data.description}
              {...register("taskDescription")}
            />
            <Flex gap={2}>
              <Button size={"sm"} type="submit" colorScheme="blue">
                Save
              </Button>
              {!descriptionIsEmpty && (
                <Button
                  variant={"outline"}
                  size={"sm"}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenEdit(false);
                  }}
                >
                  Cancel
                </Button>
              )}
            </Flex>
          </Flex>
        </form>
      )}
    </Flex>
  );
}

export { TaskDescription };
