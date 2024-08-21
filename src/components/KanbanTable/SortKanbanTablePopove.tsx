import { useContext, useRef, useState } from "react";
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
import {
  MdOutlineArrowBack,
  MdOutlineArrowDownward,
  MdOutlineArrowUpward,
  MdSort,
} from "react-icons/md";
import { KanbanDataContext } from "@/context/KanbanDataContextProvider";
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
  const { kanbanDataStore, setKanbanDataStore } = useContext(KanbanDataContext);
  const [sortName, setSortName] = useState<string | null>(null);
  const sortState = useRef<sortState>("def");

  const sortActionFuncBySortState = (state: sortState, type: sortType) => {
    if (!kanbanDataStore) {
      console.log("kanbanData Error sort");
      return;
    }

    if (type !== "priority") {
      if (state === "asc") {
        let dataSort = kanbanDataStore;
        listTableKey.forEach((key) => {
          dataSort[key].table.sort((a: any, b: any) => b[type] - a[type]);
        });
        setKanbanDataStore({ ...dataSort });
      } else if (state === "dec") {
        let dataSort = kanbanDataStore;
        listTableKey.forEach((key) => {
          dataSort[key].table.sort((a: any, b: any) => a[type] - b[type]);
        });
        setKanbanDataStore({ ...dataSort });
      }
    } else {
      if (state === "def") {
        return;
      }

      let priorityOrder: { [key in PriorityType]: number } = {
        High: 3,
        Medium: 2,
        Low: 1,
      };

      if (state === "dec") {
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

  const sortByDataSelect = (state: sortType) => {
    switch (state) {
      case "storyPoint":
        sortActionFuncBySortState(sortState.current, state);
        break;
      case "dueDate":
        sortActionFuncBySortState(sortState.current, state);
        break;
      case "priority":
        sortActionFuncBySortState(sortState.current, state);
        break;
    }
  };

  const handleSortState = () => {
    switch (sortState.current) {
      case "def":
        sortState.current = "asc";
        break;
      case "asc":
        sortState.current = "dec";
        break;
      case "dec":
        sortState.current = "asc";
        break;
    }
  };

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Button display="flex" gap={1} className="!bg-blue-400" color={"white"}>
          <MdSort className="w-6 h-6" /> Sort
        </Button>
      </PopoverTrigger>
      <PopoverContent className="!text-blue-900">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader
          fontWeight={600}
          display={"flex"}
          gap={2}
          alignItems={"center"}
        >
          Sort By {sortName ?? "..."}{" "}
          {sortState.current === "asc" ? (
            <MdOutlineArrowUpward />
          ) : sortState.current === "dec" ? (
            <MdOutlineArrowDownward />
          ) : (
            ""
          )}
        </PopoverHeader>
        <PopoverBody>
          <List>
            {listSortSelect.map((item, index) => {
              return (
                <ListItem
                  key={index}
                  className="hover:bg-blue-100 py-2 px-2 cursor-pointer rounded-md"
                  onClick={() => {
                    setSortName(item.label);
                    handleSortState();
                    sortByDataSelect(item.state);
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
