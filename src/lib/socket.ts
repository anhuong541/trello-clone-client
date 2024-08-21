import { io } from "socket.io-client";

export const socket = io("http://localhost:3456", { withCredentials: true });
