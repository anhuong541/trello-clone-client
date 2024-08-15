import { cn } from "@/lib/utils";
import { TaskItem } from "@/types";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  CSSProperties,
  MouseEventHandler,
  ReactNode,
  useMemo,
  useRef,
} from "react";

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
    border: isOver ? "1px solid #3399FF" : "1px solid #DBEAFE",
    borderRadius: "8px",
  };

  return (
    <div ref={setNodeRef} style={style} className={cn("", props.className)}>
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
  const ref = useRef<any>(null);
  const refOffsetWidth = useRef(0);
  const refPosition = useRef<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
    data: props.dataItem,
    disabled: props.disableDrag,
  });

  useMemo(() => {
    if (attributes["aria-pressed"]) {
      const rect = ref.current?.getBoundingClientRect();
      refOffsetWidth.current = ref.current?.offsetWidth;
      refPosition.current = { top: rect?.top, left: rect?.left };
    }
    // New drag take the old position
  }, [attributes]);

  const style: CSSProperties | undefined = useMemo(() => {
    return transform
      ? {
          transform: CSS.Translate.toString(transform),
          position: "fixed",
          width: refOffsetWidth.current,
          top: refPosition.current?.top,
          left: refPosition.current?.left,
          zIndex: 99999,
          border: "1px solid #3B82F6",
          borderRadius: "8px",
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
      <div ref={ref} className={cn("space-y-2", props.className)}>
        {props.children}
      </div>
    </div>
  );
}

export { Draggable, Droppable };
