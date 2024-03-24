import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import "ui/dist/style.css";
import { cn } from "ui";
import { Toaster } from "ui/shadcn-ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dailyscrum | Kiwiy is",
  description: "",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased")}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
