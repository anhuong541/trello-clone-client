"use client";

import { Button } from "@/components/common/Button";
import axios from "axios";

export default function DemoPage() {
  const getApi = async () => {
    await axios.post("http://localhost:3456/user/login", {
      email: "defaultuser@gmail.com",
      password: "123123",
    });
  };

  return (
    <div className="flex gap-4 p-4">
      <Button onClick={getApi}>Test Api</Button>
    </div>
  );
}
