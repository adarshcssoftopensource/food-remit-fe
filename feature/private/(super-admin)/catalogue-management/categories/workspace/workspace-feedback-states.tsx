"use client";

import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";

export function WorkspaceSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-5 w-72 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
      <div className="h-40 animate-pulse rounded-3xl bg-slate-200/70 dark:bg-slate-800/60" />
      <div className="grid gap-5 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/60"
          />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/60" />
    </div>
  );
}

export function CategoryNotAvailable({ onExit }: { onExit: () => void }) {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <FolderOpen className="h-16 w-16 text-slate-300" />
      <h2 className="text-2xl font-bold tracking-tight text-slate-700 dark:text-slate-200">
        Category not available
      </h2>
      <p className="max-w-sm text-sm text-slate-500">
        This category doesn&apos;t exist or doesn&apos;t belong to your store.
      </p>
      <Button onClick={onExit} variant="outline" className="mt-2 rounded-xl px-6">
        Back to Categories
      </Button>
    </div>
  );
}
