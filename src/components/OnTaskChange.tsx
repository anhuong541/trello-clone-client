import { onChangeTaskState } from "@/actions/query-actions";
import { reactQueryKeys } from "@/lib/react-query-keys";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdOutlineDescription } from "react-icons/md";
import { useContext, useState } from "react";
import { Button, useDisclosure, Flex, Text, Textarea } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { TaskItem } from "@/types";
import { KanbanDataContext } from "@/context/kanbanTable";

function TaskDescription({ dataInput }: { dataInput: TaskItem }) {
  const { kanbanDataStore, setKanbanDataStore } = useContext(KanbanDataContext);
  const { register, handleSubmit, watch, reset } = useForm<{
    taskDescription: string;
  }>();
  const [openEdit, setOpenEdit] = useState(false);
  const descriptionIsEmpty = dataInput?.description?.length === 0;

  const onUserEdit = useMutation({
    mutationFn: onChangeTaskState,
    mutationKey: [reactQueryKeys.updateTask],
  });

  const onSubmit: SubmitHandler<{
    taskDescription: string;
  }> = async (data) => {
    if (kanbanDataStore) {
      //   console.log("data => ", data);
      const labelIndex: number = kanbanDataStore
        ?.map((item) => item.label)
        .indexOf(dataInput.taskStatus);

      console.time("table");

      const tableItemIndex: any =
        labelIndex >= 0 &&
        kanbanDataStore[labelIndex].table
          .map((item) => item.taskId)
          .indexOf(dataInput.taskId); // it trigger false somewhere and i don't know where

      let itemTable = kanbanDataStore[labelIndex].table;
      if (tableItemIndex >= 0) {
        itemTable[tableItemIndex] = {
          ...itemTable[tableItemIndex],
          description: data.taskDescription,
        };
      }

      console.timeEnd("table");

      console.log({
        itemTable,
        taskDescription: data.taskDescription,
        tableItemIndex,
      });

      const arrChange = kanbanDataStore.map((item) => {
        if (item.label !== dataInput.taskStatus) {
          return item;
        } else {
          return {
            label: item.label,
            table: itemTable,
          };
        }
      });

      setKanbanDataStore((prev) => (prev = arrChange));
      await onUserEdit.mutateAsync({
        ...dataInput,
        description: data.taskDescription,
      });
      setOpenEdit(false);
    }
    reset();
  };

  //   console.log({ dataInput });

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
      {!openEdit && !descriptionIsEmpty && dataInput?.description}
      {(openEdit || descriptionIsEmpty) && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex flexDirection={"column"} gap={2}>
            <Textarea
              defaultValue={dataInput?.description}
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
