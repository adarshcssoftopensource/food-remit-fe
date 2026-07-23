import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Food Remit – Do Your Part",
    template: "%s | Food Remit",
  },
  description:
    "Food Remit connects donors and food banks to reduce hunger and food waste. Sign in to manage your contributions.",
  metadataBase: new URL("https://foodremit.com"),
  openGraph: {
    title: "Food Remit – Do Your Part",
    description: "Food Remit connects donors and food banks to reduce hunger and food waste.",
    siteName: "Food Remit",
    type: "website",
  },
};

import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
