import { MdOutlineMoreHoriz } from "react-icons/md";
import { Button } from "./common/Button";

export default function ProjectSelect({ item }: any) {
  return (
    <div className="wrappper relative group">
      <div className="flex justify-between w-full items-center px-4 py-2 group-hover:bg-gray-100 cursor-pointer">
        <p>{item.title}</p>
      </div>
      <Button
        size="icon"
        variant="icon"
        className="absolute top-[50%] -translate-y-1/2 right-4 group-hover:bg-gray-100 hover:!bg-gray-300"
        onClick={() => console.log("project option")}
      >
        <MdOutlineMoreHoriz />
      </Button>
    </div>
  );
}
