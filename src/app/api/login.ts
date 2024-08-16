import { createSession } from "@/actions/auth-action";
import { onUserLogin } from "@/actions/query-actions";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.send("hello workld");
  console.log("hello woatbfasf");
  const dataInput = req.body;
  try {
    const result = await onUserLogin(dataInput);
    createSession(result.data.token);
    res.status(200).json({ message: "", status: "success", feat: "api login" });
  } catch (error) {
    console.log("api login error: ", error);
    res.json(error);
  }
}
