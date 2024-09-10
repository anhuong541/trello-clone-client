"use client";

import React, { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import DragBoard from "./DragFeat/Board";

const tasks = [
  { id: "1", positionId: "Open_2", content: "First task" },
  { id: "2", positionId: "In-progress_4", content: "Second task" },
  { id: "3", positionId: "Open_1", content: "Third task" },
  { id: "4", positionId: "Open_3", content: "Fourth task" },
  { id: "5", positionId: "Resolved_5", content: "Fifth task" },
];

const taskStatus = {
  Open: {
    label: "Open",
    items: tasks,
  },
  "In-progress": {
    label: "In-progress",
    items: [],
  },
  Resolved: {
    label: "Resolved",
    items: [],
  },
  Closed: {
    label: "Closed",
    items: [],
  },
};

const listTaskStatus = ["Open", "In-progress", "Resolved", "Closed"];

const handleChangeDataBoardAfterDragEnd = (source, destination, columns) => {
  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    console.log("logic 1: ");
    return {
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    };
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    console.log("logic 2: ");
    return {
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    };
  }
};

const setupStartColumn = (data) => {
  const mapData = new Map();
  listTaskStatus.forEach((status) => {
    const listItem = data[status]?.items.sort((a, b) => {
      return a.positionId.split("_")[1] - b.positionId.split("_")[1];
    });

    listItem.forEach((item) => {
      const itemStatus = item.positionId.split("_")[0];
      const store = mapData?.get(itemStatus);
      if (store) {
        mapData.set(itemStatus, [...store, item]);
      } else {
        mapData.set(itemStatus, [item]);
      }
    });
  });

  const dataKanbanBoard = {
    Open: {
      label: "Open",
      items: mapData.get("Open") ?? [],
    },
    "In-progress": {
      label: "In-progress",
      items: mapData.get("In-progress") ?? [],
    },
    Resolved: {
      label: "Resolved",
      items: mapData.get("Resolved") ?? [],
    },
    Closed: {
      label: "Closed",
      items: mapData.get("Closed") ?? [],
    },
  };

  console.log({ dataKanbanBoard });

  return dataKanbanBoard;
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;
  console.log({ columns });

  const returnListData = handleChangeDataBoardAfterDragEnd(source, destination, columns);
  setColumns({ ...returnListData });
};

function DemoPage() {
  const [columns, setColumns] = useState(setupStartColumn(taskStatus));
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Jira Board</h1>
      <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
        <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                key={columnId}
              >
                <h2>{column.label}</h2>
                <DragBoard columnId={columnId} column={column} />
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
}

export default DemoPage;
