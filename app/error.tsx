"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Application Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-6 text-center">
      <div className="bg-destructive/10 text-destructive mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
      <p className="text-muted-foreground mt-2 max-w-md text-sm">
        We encountered an unexpected error. Please try reloading the page.
      </p>
      {error?.message && (
        <p className="bg-muted text-muted-foreground mt-3 max-w-lg rounded-md p-2.5 font-mono text-xs break-all">
          {error.message}
        </p>
      )}
      <div className="mt-6 flex gap-3">
        <Button onClick={() => reset()} variant="default" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
        <Button
          onClick={() => {
            window.location.href = "/dashboard";
          }}
          variant="outline"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
