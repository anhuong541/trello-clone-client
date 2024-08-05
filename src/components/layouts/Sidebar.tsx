"use client";

import Image from "next/image";
import ProjectSelect from "../ProjectSelect";
import AddProjectPopover from "../AddProjectPopover";
import { useEffect, useState } from "react";
import { handlerUserProjectList } from "@/actions/firebase-actions";
import { DocumentData } from "firebase/firestore";

export default function Sidebar({ userId }: { userId: string }) {
  const [projectSelectList, setProjectSelectList] = useState<DocumentData[]>(
    []
  );

  useEffect(() => {
    (async () => {
      const data = await handlerUserProjectList(userId);
      setProjectSelectList(data);
      console.log({ data });
    })();
  }, [userId]);

  return (
    <div className="col-span-2 border-r h-full flex flex-col">
      <div className="flex items-center gap-2 p-4 border-b">
        <Image
          src="/default-avatar.webp"
          alt="avatar"
          height={40}
          width={40}
          className="w-10 h-10 object-contain rounded-full"
        />
        <h2 className="font-medium text-xl">My Project</h2>
      </div>
      <div className="flex flex-col gap-2 h-full py-2">
        <div className="flex items-center justify-between px-4">
          <h3>Project List</h3>
          <AddProjectPopover />
        </div>

        {/* list project */}
        <div className="flex flex-col">
          {projectSelectList.map((item, index) => {
            return <ProjectSelect item={item} key={index} />;
          })}
        </div>
      </div>
    </div>
  );
}
