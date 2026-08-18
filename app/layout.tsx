import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/components/providers/query-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { AppToaster } from "@/components/toaster/app-toaster";
import NextTopLoader from "nextjs-toploader";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <body
        className="bg-background text-foreground flex min-h-screen flex-col"
        suppressHydrationWarning
      >
        <NuqsAdapter>
          <QueryProvider>
            <TooltipProvider>{children}</TooltipProvider>
            <AppToaster />
            <NextTopLoader color="#219113" showSpinner={false} />
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
