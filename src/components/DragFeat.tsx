import { cn } from "@/lib/utils";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  CSSProperties,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

function Droppable(props: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });
  const style = {
    color: isOver ? "green" : undefined,
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
}) {
  const ref = useRef<any>(null);
  const [offsetWidth, setOffsetWidth] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });

  //   console.log("trigger!!!!", {
  //     width: ref.current?.offsetWidth ?? "",
  //     listeners,
  //     attributes,
  //   });

  useEffect(() => {
    if (!attributes["aria-pressed"]) {
      setOffsetWidth(ref.current?.offsetWidth);
      const rect = ref.current?.getBoundingClientRect();
      setPosition({ top: rect?.top, left: rect?.left });
    }

    // console.log({
    //   offsetWidth,
    //   top: position?.top,
    //   left: position?.left,
    //   press: attributes["aria-pressed"],
    // });
  }, [attributes["aria-pressed"]]);

  const style: CSSProperties | undefined = transform
    ? {
        transform: CSS.Translate.toString(transform),
        position: "fixed",
        width: offsetWidth,
        top: position?.top,
        left: position?.left,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn("", props.className)}
    >
      <div ref={ref}>{props.children}</div>
    </div>
  );
}

export { Draggable, Droppable };