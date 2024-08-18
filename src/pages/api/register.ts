import { createSession } from "@/actions/auth-action";
import { onUserRegister } from "@/actions/query-actions";
import { Request, Response } from "express";

export default async function handler(req: Request, res: Response) {
  const dataInput = req.body;
  try {
    const result = await onUserRegister(dataInput);
    createSession(result.data.token);
    res
      .status(200)
      .json({ message: "", status: "success", feat: "api register" });
  } catch (error) {
    console.log("api register error: ", error);
    res.json(error);
  }
}
