import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import "ui/dist/style.css";
import { cn } from "ui";
import { Toaster } from "ui/shadcn-ui/toaster";
import { Suspense } from "react";
import AnalyticsScripts from "./analytics-scripts";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Kiwiy Daily Scrum",
    default: "Kiwiy Daily Scrum",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_METADATA_BASE_URL!),
  description: "",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Suspense>
        <AnalyticsScripts />
      </Suspense>
      <body className={cn(inter.className, "antialiased")}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
