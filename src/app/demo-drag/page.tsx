"use client";

// KanbanBoard.tsx
import React from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

interface Task {
  id: string;
  content: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

interface Board {
  [columnId: string]: Column;
}

const initialData: Board = {
  "column-1": {
    id: "column-1",
    title: "To Do",
    tasks: [
      { id: "task-1", content: "Task 1" },
      { id: "task-2", content: "Task 2" },
    ],
  },
  "column-2": {
    id: "column-2",
    title: "In Progress",
    tasks: [
      { id: "task-3", content: "Task 3" },
      { id: "task-4", content: "Task 4" },
    ],
  },
  "column-3": {
    id: "column-3",
    title: "Done",
    tasks: [
      { id: "task-5", content: "Task 5" },
      { id: "task-6", content: "Task 6" },
    ],
  },
};

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = React.useState(initialData);

  console.log({ columns });

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return; // If dropped outside

    const sourceColumn = columns[source.droppableId];
    const destinationColumn = columns[destination.droppableId];

    // Dragging inside the same column
    if (source.droppableId === destination.droppableId) {
      const newTaskIds = Array.from(sourceColumn.tasks);
      const [movedTask] = newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, movedTask);

      const newColumn = {
        ...sourceColumn,
        tasks: newTaskIds,
      };

      setColumns({
        ...columns,
        [sourceColumn.id]: newColumn,
      });
    } else {
      // Moving from one column to another
      const sourceTaskIds = Array.from(sourceColumn.tasks);
      const destinationTaskIds = Array.from(destinationColumn.tasks);
      const [movedTask] = sourceTaskIds.splice(source.index, 1);
      destinationTaskIds.splice(destination.index, 0, movedTask);

      const newSourceColumn = {
        ...sourceColumn,
        tasks: sourceTaskIds,
      };

      const newDestinationColumn = {
        ...destinationColumn,
        tasks: destinationTaskIds,
      };

      setColumns({
        ...columns,
        [sourceColumn.id]: newSourceColumn,
        [destinationColumn.id]: newDestinationColumn,
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {Object.values(columns).map((column) => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  margin: "8px",
                  border: "1px solid lightgrey",
                  borderRadius: "4px",
                  width: "250px",
                  minHeight: "500px",
                  padding: "8px",
                  backgroundColor: "#f4f4f4",
                }}
              >
                <h3>{column.title}</h3>
                {column.tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          userSelect: "none",
                          padding: "8px",
                          margin: "0 0 8px 0",
                          minHeight: "50px",
                          backgroundColor: "#fff",
                          color: "#333",
                          ...provided.draggableProps.style,
                        }}
                      >
                        {task.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
