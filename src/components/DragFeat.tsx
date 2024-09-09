import {
  CSSProperties,
  MouseEventHandler,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import useScreenView from "@/hooks/ScreenView";
import { TaskItem } from "@/types";
import { cn } from "@/lib/utils";
import { CSS } from "@dnd-kit/utilities";

function Droppable(props: {
  id: string;
  children: ReactNode;
  className?: string;
  // dataItem: TaskItem;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
    // data: props.dataItem,
  });
  const style: CSSProperties = {
    border: isOver ? "1px solid #3399FF" : "1px solid #eff6ff",
    borderRadius: "8px",
  };

  return (
    <div ref={setNodeRef} style={style} className={cn("dark:!border-gray-400", props.className)}>
      {props.children}
    </div>
  );
}

function DroppableItem(props: {
  id: string;
  children: ReactNode;
  className?: string;
  // dataItem: TaskItem;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
    // data: props.dataItem,
  });
  const style: CSSProperties = {
    // border: isOver ? "1px solid #3399FF" : "1px solid #eff6ff",
    borderRadius: "8px",
  };

  return (
    <div ref={setNodeRef} style={style} className={cn("dark:!border-gray-400", props.className)}>
      {props.children}
    </div>
  );
}

function Draggable(props: {
  id: string;
  children: ReactNode;
  className: string;
  dataItem: TaskItem;
  disableDrag: boolean;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
}) {
  const { screenView } = useScreenView();
  const ref = useRef<any>(null);
  const refOffsetWidth = useRef(0);
  const refPosition = useRef<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
    data: props.dataItem,
    disabled: props.disableDrag || (screenView ? Number(screenView) < 1024 : false),
  });

  useEffect(() => {
    if (!attributes["aria-pressed"]) {
      const rect = ref.current?.getBoundingClientRect();
      refOffsetWidth.current = ref.current?.offsetWidth;
      refPosition.current = { top: rect?.top, left: rect?.left };
    }
    // forgot the reason why i use Memo but it work so don't touch it :p
  }, [attributes]);

  const style: CSSProperties | undefined = useMemo(() => {
    return transform
      ? {
          transform: CSS.Translate.toString(transform),
          // `translate3d(${transform.x}px, ${transform.y}px, 0) rotate(5deg)`,
          position: "fixed",
          width: refOffsetWidth.current,
          top: refPosition.current?.top,
          left: refPosition.current?.left,
          zIndex: 99999,
          // border: "1px solid #3B82F6",
          borderRadius: "8px",
          opacity: 0.8,
        }
      : undefined;
  }, [transform]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      // className={cn("")}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      <div
        ref={ref}
        className={cn("space-y-2", props.className)}
        style={{ cursor: attributes["aria-pressed"] ? "grabbing" : "grab" }}
      >
        {props.children}
      </div>
    </div>
  );
}

export { Draggable, Droppable };
