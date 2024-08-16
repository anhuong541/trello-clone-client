"use client";

import { handleUserInfo } from "@/actions/query-actions";
import { Button } from "@/components/common/Button";
import { server } from "@/lib/network";
export default function DemoPage() {
  const getApi = async () => {
    await handleUserInfo();
  };

  return (
    <div className="flex gap-4 p-4">
      <Button onClick={getApi}>Test Api</Button>
    </div>
  );
}
