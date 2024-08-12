"use client";

import { Button } from "@/components/common/Button";
import { server } from "@/lib/network";
export default function DemoPage() {
  const getApi = async () => {
    try {
      const res = await server.get("/user");
      console.log({ res });
    } catch (error) {
      console.log("error from client: ", error);
    }
  };

  return (
    <div className="flex gap-4 p-4">
      <Button onClick={getApi}>Test Api</Button>
    </div>
  );
}
