import { cn } from "@/lib/utils";
import { TaskItem } from "@/types";
import {
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { CSSProperties, ReactNode, useMemo, useRef } from "react";

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
}) {
  const ref = useRef<any>(null);
  const refOffsetWidth = useRef(0);
  const refPosition = useRef({ top: 0, left: 0 });

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
    data: props.dataItem,
  });

  useMemo(() => {
    if (attributes["aria-pressed"]) {
      const rect = ref.current?.getBoundingClientRect();

      refOffsetWidth.current = ref.current?.offsetWidth;
      refPosition.current = { top: rect?.top, left: rect?.left };

      // console.log({
      //   offsetWidth,
      //   top: position?.top,
      //   left: position?.left,
      //   press: attributes["aria-pressed"],
      // });
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
        }
      : undefined;
  }, [transform]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn("", props.className)}
    >
      <div ref={ref} className="space-y-2">
        {props.children}
      </div>
    </div>
  );
}

export { Draggable, Droppable };
