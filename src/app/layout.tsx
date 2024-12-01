import { Open_Sans } from "next/font/google";
import type { Metadata } from "next";
import Providers from "@/providers";
import { cn } from "@/utils";
import "./globals.css";

const openSans = Open_Sans({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Trello Clone",
  description: "Trello Clone",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(openSans.className, "dark:text-white")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
