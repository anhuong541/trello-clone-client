"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import { ChakraProvider } from "@chakra-ui/react";
import "react-toastify/ReactToastify.css";
import ContextProvider from "@/context";
import Ably from "ably";
// import "react-toastify/ReactToastify.min.css";

const queryClient = new QueryClient();
export const ablyClient = new Ably.Realtime(process.env.NEXT_PUBLIC_ABLY_KEY!);

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <ContextProvider>
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
        </ContextProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}
