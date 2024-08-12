"use client";

import { Button } from "@/components/common/Button";
import { checkJwtExpire } from "@/middleware";
import axios from "axios";

export default function DemoPage() {
  const getApi = async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlZmF1bHR1c2VyQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiMTIzMTIzIiwiaWF0IjoxNzIzNDM1OTkxLCJleHAiOjE3MjM1MjIzOTF9.cXMD9Gr8yqMSiiLzml5KiG9KzCPgz8lUMI9OSUKauWg";

    const checkToken = await checkJwtExpire(token);

    // if (checkToken.response.status === 401) {
    // }

    console.log({ checkToken: checkToken });
  };

  return (
    <div className="flex gap-4 p-4">
      <Button onClick={getApi}>Test Api</Button>
    </div>
  );
}
