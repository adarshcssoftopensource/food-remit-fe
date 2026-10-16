"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StoreFloatingSaveBarProps {
  isMobile: boolean;
  sidebarOffset: number;
  isDirty: boolean;
  isPending: boolean;
}

export function StoreFloatingSaveBar({
  isMobile,
  sidebarOffset,
  isDirty,
  isPending,
}: StoreFloatingSaveBarProps) {
  return (
    <div
      style={{
        left: isMobile ? 0 : sidebarOffset,
        right: 0,
      }}
      className="pointer-events-none fixed bottom-5 z-40 flex justify-center px-4 transition-all duration-200"
    >
      <div className="pointer-events-auto flex w-full max-w-2xl items-center justify-between gap-4 rounded-2xl border border-white/80 bg-white/95 px-6 py-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:min-w-140 dark:border-slate-800/90 dark:bg-slate-900/95 dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 pl-2">
          {isDirty ? (
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <span className="size-2 animate-pulse rounded-full bg-amber-500" />
              Unsaved changes
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="size-2 rounded-full bg-emerald-500" />
              All details saved
            </span>
          )}
        </div>
        <Button
          form="store-info-form"
          type="submit"
          disabled={!isDirty || isPending}
          isLoading={isPending}
          className="h-11 rounded-xl bg-[#1B3A8C] text-sm font-bold text-white hover:bg-[#1B3A8C]/90 hover:shadow-lg dark:bg-indigo-600 dark:hover:bg-indigo-700"
        >
          <Check className="h-4 w-4" />
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
