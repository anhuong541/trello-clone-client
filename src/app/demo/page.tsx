"use client";

import { socket } from "@/lib/socket";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const projectId = "cd12b604-7b96-44fc-8830-16a2ca2e1baf";

export default function DemoPage() {
  const { register, handleSubmit, watch, reset } = useForm<any>();
  const [count, setCount] = useState(0);

  useEffect(() => {
    socket.on(`project_room_${projectId}`, (data) => {
      console.log("sf");
      console.log("it trigger!!!", data);
    });

    return () => {
      socket.off(`project_room_${projectId}`);
    };
  }, []);

  const onSubmit: SubmitHandler<any> = async (data) => {
    socket.emit("project_room", projectId);
    // reset();
  };

  console.log("count => ", count);

  return (
    <div>
      <div className="p-5 flex flex-col gap-2 w-[500px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("message")}
            type="text"
            placeholder="chat message"
            className="border px-2 py-1"
          />
          <button className="border px-2 py-1 active:bg-gray-50 hover:bg-gray-100" type="submit">
            send
          </button>
        </form>

        <p>{count}</p>

        <button onClick={() => setCount(count + 1)}>count</button>
      </div>
    </div>
  );
}
