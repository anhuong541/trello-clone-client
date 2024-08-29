import { onChangeTaskState } from "@/actions/query-actions";
import { KanbanDataContext } from "@/context/KanbanDataContextProvider";
import { reactQueryKeys } from "@/lib/react-query-keys";
import { PriorityType, TaskItem, TaskStatusType } from "@/types";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Button,
  List,
  ListItem,
  useDisclosure,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { toast } from "react-toastify";

const listStatus: TaskStatusType[] = ["Open", "In-progress", "Resolved", "Closed"];

export default function UpdateTaskStatus({ dataInput }: { dataInput: TaskItem }) {
  const queryClient = useQueryClient();
  const { kanbanDataStore } = useContext(KanbanDataContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onUserEdit = useMutation({
    mutationFn: onChangeTaskState,
    mutationKey: [reactQueryKeys.updateTask],
  });

  const onSelectStatus = async (taskStatus: TaskStatusType) => {
    if (!kanbanDataStore) {
      toast.error("Something wrong at the board! Please restart and do again!");
      return;
    }

    await onUserEdit.mutateAsync({
      ...dataInput,
      taskStatus,
      dueDate: Date.now(),
    });
    onClose();
    queryClient.refetchQueries({
      queryKey: [reactQueryKeys.projectList],
    });
  };

  return (
    <Popover isOpen={isOpen} onClose={onClose}>
      <PopoverTrigger>
        <Button variant="link" fontSize="md" onClick={onOpen}>
          {dataInput.taskStatus}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="!bg-gray-50 !w-[220px]">
        <PopoverArrow className="!bg-gray-50" />
        <PopoverCloseButton />
        <PopoverHeader paddingLeft={5} color="black" fontWeight={600}>
          Change Table Status
        </PopoverHeader>
        <PopoverBody>
          <List>
            {listStatus
              .filter((item) => item !== dataInput.taskStatus)
              .map((item) => {
                return (
                  <ListItem
                    key={item}
                    value={item}
                    className="hover:bg-blue-400 hover:text-white px-2 py-1 rounded-md cursor-pointer"
                    onClick={async () => await onSelectStatus(item)}
                  >
                    {item}
                  </ListItem>
                );
              })}
          </List>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
