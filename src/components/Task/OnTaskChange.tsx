import { Button, Flex, Input, Select, Text, Textarea } from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  MdNumbers,
  MdOutlineDescription,
  MdOutlineVideoLabel,
} from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { onChangeTaskState } from "@/actions/query-actions";
import { KanbanDataContext } from "@/context/KanbanDataContextProvider";
import { reactQueryKeys } from "@/lib/react-query-keys";
import { PriorityType, StoryPointType, TaskItem } from "@/types";
import { toast } from "react-toastify";

function TaskTitle({ dataInput }: { dataInput: TaskItem }) {
  const { kanbanDataStore, setKanbanDataStore } = useContext(KanbanDataContext);
  const [editTitle, setEditTitle] = useState(false);
  const { register, handleSubmit, watch, reset } = useForm<{
    taskTitle: string;
  }>();

  const onUserEdit = useMutation({
    mutationFn: onChangeTaskState,
    mutationKey: [reactQueryKeys.updateTask],
  });

  const onSubmit: SubmitHandler<{
    taskTitle: string;
  }> = async (data) => {
    if (data.taskTitle === "") {
      toast.error("A task can missing a name!");
      return;
    }

    if (kanbanDataStore) {
      console.log("data => ", data);
      const tableItemIndex = kanbanDataStore[dataInput.taskStatus].table
        .map((item) => item.taskId)
        .indexOf(dataInput.taskId);

      let itemTable = kanbanDataStore[dataInput.taskStatus].table;
      if (tableItemIndex >= 0) {
        // condition >= 0 because the logic read 0 is false
        itemTable[tableItemIndex] = {
          ...itemTable[tableItemIndex],
          title: data.taskTitle,
        };
      }

      setKanbanDataStore({
        ...kanbanDataStore,
        [dataInput.taskStatus]: {
          ...kanbanDataStore[dataInput.taskStatus],
          table: [...itemTable],
        },
      });

      await onUserEdit.mutateAsync({
        ...dataInput,
        title: data.taskTitle,
      });
      setEditTitle(false);
    }
    reset();
  };

  if (!editTitle) {
    return (
      <Text
        gap={2}
        fontSize="lg"
        display="flex"
        fontWeight="bold"
        alignItems="center"
        onDoubleClick={() => setEditTitle(true)}
      >
        <MdOutlineVideoLabel className="w-6 h-6" /> {dataInput.title}
      </Text>
    );
  } else {
    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="min-h-[27px] flex items-center gap-2 pr-8"
      >
        <MdOutlineVideoLabel className="w-6 h-6" />
        <Input
          type="text"
          defaultValue={dataInput?.title}
          placeholder="Can't miss the task name"
          className="text-sm font-bold"
          size={"md"}
          {...register("taskTitle")}
        />
      </form>
    );
  }
}

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
      console.log("data => ", data);
      const tableItemIndex = kanbanDataStore[dataInput.taskStatus].table
        .map((item) => item.taskId)
        .indexOf(dataInput.taskId);

      let itemTable = kanbanDataStore[dataInput.taskStatus].table;
      if (tableItemIndex >= 0) {
        // condition >= 0 because the logic read 0 is false
        itemTable[tableItemIndex] = {
          ...itemTable[tableItemIndex],
          description: data.taskDescription,
        };
      }

      let dataChanging = kanbanDataStore;
      dataChanging[dataInput.taskStatus] = {
        label: dataInput.taskStatus,
        table: itemTable,
      };

      setKanbanDataStore({ ...dataChanging });
      await onUserEdit.mutateAsync({
        ...dataInput,
        description: data.taskDescription,
      });
      setOpenEdit(false);
    }
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

      {!openEdit && !descriptionIsEmpty && (
        <Text className="pl-8">{dataInput?.description}</Text>
      )}
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

type StorySubmitType = { taskStoryPoint: StoryPointType };

function TaskStoryPoint({ dataInput }: { dataInput: TaskItem }) {
  const { kanbanDataStore, setKanbanDataStore } = useContext(KanbanDataContext);
  const [openEditSP, setOpenEditSP] = useState(false);
  const { register, handleSubmit, watch, reset } = useForm<StorySubmitType>();

  const onUserEdit = useMutation({
    mutationFn: onChangeTaskState,
    mutationKey: [reactQueryKeys.updateTask],
  });

  const onSubmit: SubmitHandler<StorySubmitType> = async (data) => {
    const storyPoint = Number(data.taskStoryPoint);
    const listStoryPointAccepted = [1, 2, 3, 5, 8, 13, 21];
    if (!listStoryPointAccepted.includes(storyPoint)) {
      toast.error("The Story Point is not valid");
      return;
    }

    if (!kanbanDataStore) {
      toast.error("Something wrong at the board! Please restart and do again!");
      return;
    }

    console.log("data => ", data);
    const tableItemIndex = kanbanDataStore[dataInput.taskStatus].table
      .map((item) => item.taskId)
      .indexOf(dataInput.taskId);

    let itemTable = kanbanDataStore[dataInput.taskStatus].table;
    if (tableItemIndex >= 0) {
      // condition >= 0 because the logic read 0 is false
      itemTable[tableItemIndex] = {
        ...itemTable[tableItemIndex],
        storyPoint: storyPoint as StoryPointType,
      };
    }

    setKanbanDataStore({
      ...kanbanDataStore,
      [dataInput.taskStatus]: {
        ...kanbanDataStore[dataInput.taskStatus],
        table: [...itemTable],
      },
    });

    await onUserEdit.mutateAsync({
      ...dataInput,
      storyPoint: storyPoint as StoryPointType,
    });
    setOpenEditSP(false);
    reset();
  };

  return (
    <Flex flexDirection={"column"} gap={2}>
      <Flex gap={4} justifyContent="space-between" alignItems="center">
        <Flex gap={2}>
          <MdNumbers className="w-6 h-6" />
          <Text fontWeight={600} marginRight={6}>
            Cost <strong className="font-bold">{dataInput.storyPoint}</strong>{" "}
            Story Point
          </Text>
        </Flex>
        {!openEditSP && (
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => setOpenEditSP(true)}
          >
            Change
          </Button>
        )}
      </Flex>
      {openEditSP && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex flexDirection={"column"} gap={2}>
            <Input
              type="number"
              placeholder="Only allow 1 | 2 | 3 | 5 | 8 | 13 | 21"
              {...register("taskStoryPoint")}
            />
            <Flex gap={2}>
              <Button size={"sm"} type="submit" colorScheme="blue">
                Save
              </Button>
              <Button
                size={"sm"}
                colorScheme="gray"
                onClick={() => {
                  setOpenEditSP(false);
                  reset();
                }}
              >
                Cancel
              </Button>
            </Flex>
          </Flex>
        </form>
      )}
    </Flex>
  );
}

function TaskPriority({ dataInput }: { dataInput: TaskItem }) {
  const { kanbanDataStore, setKanbanDataStore } = useContext(KanbanDataContext);
  const onUserEdit = useMutation({
    mutationFn: onChangeTaskState,
    mutationKey: [reactQueryKeys.updateTask],
  });

  const onSelectPriority = async (priority: PriorityType) => {
    if (!kanbanDataStore) {
      toast.error("Something wrong at the board! Please restart and do again!");
      return;
    }

    console.log("data => ", priority);
    const tableItemIndex = kanbanDataStore[dataInput.taskStatus].table
      .map((item) => item.taskId)
      .indexOf(dataInput.taskId);

    let itemTable = kanbanDataStore[dataInput.taskStatus].table;
    if (tableItemIndex >= 0) {
      // condition >= 0 because the logic read 0 is false
      itemTable[tableItemIndex] = {
        ...itemTable[tableItemIndex],
        priority,
      };
    }

    setKanbanDataStore({
      ...kanbanDataStore,
      [dataInput.taskStatus]: {
        ...kanbanDataStore[dataInput.taskStatus],
        table: [...itemTable],
      },
    });

    await onUserEdit.mutateAsync({
      ...dataInput,
      priority,
    });
  };

  return (
    <Flex flexDirection={"column"} gap={2}>
      <Flex gap={4} justifyContent="space-between" alignItems="center">
        <Flex gap={2}>
          <MdNumbers className="w-6 h-6" />
          <Text fontWeight={600} marginRight={6}>
            Current priority is{" "}
            <strong className="font-bold">{dataInput.priority}</strong>{" "}
          </Text>
        </Flex>
      </Flex>
      <Select
        placeholder="Select your priority"
        onChange={(e) => onSelectPriority(e.target?.value as PriorityType)}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </Select>
    </Flex>
  );
}

export { TaskDescription, TaskStoryPoint, TaskTitle, TaskPriority };
