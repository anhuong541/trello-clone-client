"use client";

import KanbanDataContextProvider from "@/context/KanbanDataContextProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import { ChakraProvider } from "@chakra-ui/react";
import "react-toastify/ReactToastify.css";
import UserInfoContextProvider from "@/context/UserInfoContextProvider";
// import "react-toastify/ReactToastify.min.css";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <UserInfoContextProvider>
          <KanbanDataContextProvider>
            {children}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={true}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </KanbanDataContextProvider>
        </UserInfoContextProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}
