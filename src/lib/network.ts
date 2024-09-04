import axios from "axios";

export const isProduction = process.env.NEXT_PUBLIC_NODE_ENV! === "production";

export const server = axios.create({
  baseURL: isProduction ? process.env.NEXT_PUBLIC_SERVER_DOMAIN : "http://localhost:3456/",
  withCredentials: true,
});

server.interceptors.request.use(
  (config) => {
    const authToken = localStorage && (localStorage.getItem("token") ?? null);
    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

export const serverCl = axios.create({
  baseURL: isProduction ? process.env.NEXT_PUBLIC_SERVER_DOMAIN : "http://localhost:3456/",
  withCredentials: true,
});
