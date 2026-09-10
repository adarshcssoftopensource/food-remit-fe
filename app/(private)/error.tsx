"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivateSectionError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard / Private Route Error:", error);
  }, [error]);

  return (
    <div className="border-border bg-card flex min-h-[400px] w-full flex-col items-center justify-center rounded-2xl border p-6 text-center shadow-sm">
      <div className="bg-destructive/10 text-destructive mb-4 flex h-14 w-14 items-center justify-center rounded-full">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h2 className="text-xl font-semibold tracking-tight">Unable to load dashboard section</h2>
      <p className="text-muted-foreground mt-2 max-w-md text-sm">
        An error occurred while rendering this page. You can try refreshing the section.
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
            window.location.reload();
          }}
          variant="outline"
        >
          Reload Page
        </Button>
      </div>
    </div>
  );
}
