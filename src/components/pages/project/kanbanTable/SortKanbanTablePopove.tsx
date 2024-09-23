import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import { Button, List, ListItem } from "@chakra-ui/react";
import { MdOutlineArrowDownward, MdOutlineArrowUpward, MdSort } from "react-icons/md";
import { KanbanDataContextHook } from "@/context/KanbanDataContextProvider";
import { listTableKey } from "./KanbanBoard";
import { PriorityType } from "@/types";

type sortType = "storyPoint" | "priority" | "dueDate";
type sortState = "asc" | "dec" | "def";

const listSortSelect: {
  label: string;
  state: sortType;
}[] = [
  {
    label: "Story Point",
    state: "storyPoint",
  },
  {
    label: "Priority",
    state: "priority",
  },
  {
    label: "Last time edited",
    state: "dueDate",
  },
];

export default function SortKanbanTablePopover() {
  const { kanbanDataStore, setKanbanDataStore } = KanbanDataContextHook();
  const [sortName, setSortName] = useState<string | null>(null);
  const [sortState, setSortState] = useState<sortState>("def");

  const handleSortState = () => {
    switch (sortState) {
      case "def":
        setSortState((prev) => (prev = "asc"));
        break;
      case "asc":
        setSortState((prev) => (prev = "dec"));
        break;
      case "dec":
        setSortState((prev) => (prev = "asc"));
        break;
    }
  };

  const sortActionFuncBySortState = (type: sortType) => {
    if (!kanbanDataStore) {
      console.log("kanbanData Error sort");
      return;
    }

    if (type !== "priority") {
      if (sortState === "asc") {
        let dataSort = kanbanDataStore;
        listTableKey.forEach((key) => {
          dataSort[key].table.sort((a: any, b: any) => b[type] - a[type]);
        });
        setKanbanDataStore({ ...dataSort });
      } else if (sortState === "dec") {
        let dataSort = kanbanDataStore;
        listTableKey.forEach((key) => {
          dataSort[key].table.sort((a: any, b: any) => a[type] - b[type]);
        });
        setKanbanDataStore({ ...dataSort });
      }
    } else {
      // if (sortState === "def") {
      //   return;
      // }
      // only open when state default is active at handleSortState()

      let priorityOrder: { [key in PriorityType]: number } = {
        High: 3,
        Medium: 2,
        Low: 1,
      };

      if (sortState === "dec") {
        priorityOrder = {
          High: 1,
          Medium: 2,
          Low: 3,
        };
      }

      let dataSort = kanbanDataStore;
      listTableKey.forEach((key) => {
        dataSort[key].table.sort((a, b) => {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
      });
      setKanbanDataStore({ ...dataSort });
    }
  };

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Button display="flex" gap={1} className="!bg-blue-400 dark:!bg-gray-600" color="white">
          <MdSort className="w-6 h-6" /> Sort
        </Button>
      </PopoverTrigger>
      <PopoverContent className="!text-blue-900 dark:!text-white">
        <PopoverArrow />
        <PopoverHeader fontWeight={600} display="flex" gap={1} alignItems="center">
          {sortState === "asc" ? (
            <MdOutlineArrowUpward className="h-5 w-5" />
          ) : sortState === "dec" ? (
            <MdOutlineArrowDownward className="h-5 w-5" />
          ) : (
            ""
          )}
          Sort By {sortName ?? "..."}
        </PopoverHeader>
        <PopoverBody>
          <List>
            {listSortSelect.map((item, index) => {
              return (
                <ListItem
                  key={index}
                  className="hover:bg-blue-100 dark:hover:bg-gray-600 py-2 px-2 cursor-pointer rounded-md"
                  onClick={() => {
                    setSortName(item.label);
                    handleSortState();
                    sortActionFuncBySortState(item.state);
                  }}
                >
                  {item.label}
                </ListItem>
              );
            })}
          </List>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
