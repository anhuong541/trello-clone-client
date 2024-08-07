import axios from "axios";

export const server = axios.create({
  baseURL: process.env.SERVER_DOMAIN ?? "http://localhost:3456/",
});
