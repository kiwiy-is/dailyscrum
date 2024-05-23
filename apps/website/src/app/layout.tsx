import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "ui/dist/style.css";
import { cn } from "ui";

const inter = Inter({ subsets: ["latin"] });

const metadataDescription =
  "Simplify your daily scrum with Kiwiy Daily Scrum, a free, open-source board for agile teams. Share updates in seconds and track your team's status effortlessly. No more copying and pasting templates in Slack. Focus on delivering value.";

export const metadata: Metadata = {
  title: "Kiwiy Daily Scrum",
  description: metadataDescription,
  openGraph: {
    title: "Kiwiy Daily Scrum - A board to streamline team daily scrum",
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
      <body className={cn(inter.className, "antialiased")}>{children}</body>
    </html>
  );
}
