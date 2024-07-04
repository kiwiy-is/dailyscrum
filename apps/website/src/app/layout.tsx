import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "ui/dist/style.css";
import { cn } from "ui";
import AnalyticsScripts from "./analytics-scripts";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

const metadataTitle =
  "Kiwiy Daily Scrum | Minimalist daily scrum board for your team";

const metadataDescription =
  "A free minimalist daily scrum board for your team. Share updates in seconds and keep your team in sync with a centralized, real-time board view. Easily invite team members, add daily updates, and use the board during meetings. Enjoy all features for free.";

export const metadata: Metadata = {
  title: metadataTitle,
  description: metadataDescription,
  keywords: [
    "daily scrum board",
    "daily updates",
    "team updates",
    "team productivity",
    "real-time board",
    "team collaboration",
    "open-source",
    "daily scrum questions",
    "dedicated workspace",
    "Kiwiy Daily Scrum",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_METADATA_BASE_URL!),
  openGraph: {
    title: metadataTitle,
    description: metadataDescription,
    url: "https://dailyscrum.kiwiy.is",
    siteName: "Kiwiy Daily Scrum",
    locale: "en_US",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Suspense>
        <AnalyticsScripts />
      </Suspense>
      <body className={cn(inter.className, "antialiased")}>{children}</body>
    </html>
  );
}
