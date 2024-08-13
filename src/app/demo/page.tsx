"use client";

import React, { ReactNode, useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";

function Droppable(props: { id: string; children: ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}

function Draggable(props: any) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: props.id,
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      {props.children}
    </div>
  );
}

export default function DemoPage() {
  const [items] = useState(["1", "2", "3", "4", "5"]);
  const [activeId, setActiveId] = useState(null);

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {items.map((id) => (
        <Draggable key={id} id={id}>
          {/* <Item value={`Item ${id}`} /> */}
          <div className="h-14 w-14 bg-red-400" />
        </Draggable>
      ))}
      fasvfvas
      <DragOverlay>
        {activeId ? <div className="h-14 w-14 bg-red-400" /> : null}
      </DragOverlay>
    </DndContext>
  );

  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  function handleDragEnd() {
    setActiveId(null);
  }
}
