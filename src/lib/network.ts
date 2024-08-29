import axios from "axios";

const isProduction = process.env.NEXT_PUBLIC_NODE_ENV === "production";

export const server = axios.create({
  baseURL: isProduction ? process.env.NEXT_PUBLIC_SERVER_DOMAIN : "http://localhost:3456/",
  withCredentials: true,
});
