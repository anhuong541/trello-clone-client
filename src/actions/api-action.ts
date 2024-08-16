import { LoginInputType, RegisterInputType } from "@/types/query-types";
import axios from "axios";

export const getApiLogin = async (dataInput: LoginInputType) => {
  return await axios.post("/api/login", dataInput);
};

export const getRegisterLogin = async (dataInput: RegisterInputType) => {
  return await axios.post("/api/register", dataInput);
};
