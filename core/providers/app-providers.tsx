"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/components/providers/query-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { AppToaster } from "@/components/toaster/app-toaster";
import NextTopLoader from "nextjs-toploader";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <NuqsAdapter>
      <QueryProvider>
        <TooltipProvider>{children}</TooltipProvider>
        <AppToaster />
        <NextTopLoader color="#219113" showSpinner={false} />
      </QueryProvider>
    </NuqsAdapter>
  );
}
