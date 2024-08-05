import { MdOutlineMoreHoriz } from "react-icons/md";
import { DocumentData } from "firebase/firestore";
import { Button } from "./common/Button";
import ProjectItemOption from "./ProjectItemOption";

export default function ProjectSelect({ item }: { item: DocumentData }) {
  return (
    <div className="wrappper relative group">
      <div className="flex justify-between w-full items-center px-4 py-2 group-hover:bg-gray-100 cursor-pointer">
        <p>{item.projectName}</p>
      </div>
      <div className="absolute top-[50%] -translate-y-1/2 right-4 group-hover:bg-gray-100 hover:!bg-gray-300 rounded-md">
        <ProjectItemOption projectTitle={item.projectName} />
      </div>
    </div>
  );
}
