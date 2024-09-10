import { Droppable } from "@hello-pangea/dnd";
import TaskDetail from "./Task";

export default function DragBoard({
  columnId,
  column,
}: {
  columnId: string;
  column: { items: any[] };
}) {
  return (
    <div style={{ margin: 8 }}>
      <Droppable droppableId={columnId} key={columnId}>
        {(provided, snapshot) => {
          return (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                background: snapshot.isDraggingOver ? "lightblue" : "lightgrey",
                padding: 4,
                width: 250,
                minHeight: 500,
              }}
            >
              {column.items.map((item, index) => {
                return <TaskDetail key={item.id} index={index} item={item} />;
              })}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
}
