"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw } from "lucide-react";

interface DashboardErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function DashboardErrorState({
  message = "Failed to load dashboard data. Please check your connection and try again.",
  onRetry,
}: DashboardErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center dark:border-rose-900/50 dark:bg-rose-950/20">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-400">
        <AlertCircle size={24} />
      </div>
      <h3 className="mt-3 text-base font-bold text-slate-800 dark:text-slate-200">
        Dashboard Loading Error
      </h3>
      <p className="mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="mt-4 gap-1.5 rounded-lg border-rose-300 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-800 dark:text-rose-300"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Retry Connection
        </Button>
      )}
    </div>
  );
}
