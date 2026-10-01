"use client";

import { CornerDownLeft, FolderOpen, Loader2 } from "lucide-react";
import type React from "react";

export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-slate-200 bg-white px-1 font-sans text-[10px] font-semibold text-slate-500 shadow-xs dark:border-slate-700 dark:bg-slate-800">
      {children}
    </kbd>
  );
}

export function PickerSkeleton() {
  return (
    <div className="space-y-1 px-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex h-15 items-center gap-3 rounded-xl px-3">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-2/5 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-2.5 w-1/4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PickerState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-56 flex-col items-center justify-center gap-2 px-6 text-center">
      {icon}
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</p>
      <p className="max-w-xs text-xs text-slate-500">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function PickerEmptyState({ debouncedSearch }: { debouncedSearch: string }) {
  return (
    <PickerState
      icon={<FolderOpen className="h-9 w-9 text-slate-300" />}
      title={debouncedSearch ? `No categories match "${debouncedSearch}"` : "No categories yet"}
      description={
        debouncedSearch
          ? "Check the spelling or try a shorter search."
          : "Create a category first, then add items to it."
      }
    />
  );
}

export function PickerLoadMoreRow({ isError, onRetry }: { isError: boolean; onRetry: () => void }) {
  return (
    <div className="flex h-full items-center justify-center gap-2 text-xs text-slate-400">
      {isError ? (
        <button
          type="button"
          onClick={onRetry}
          className="text-primary font-semibold hover:underline"
        >
          Couldn&apos;t load more — retry
        </button>
      ) : (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Loading more…
        </>
      )}
    </div>
  );
}

export function PickerFooter({ count, hasNextPage }: { count: number; hasNextPage: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-2.5 text-[11px] text-slate-500 dark:border-slate-800 dark:bg-slate-900/50">
      <span>
        {count > 0
          ? `${count.toLocaleString()}${hasNextPage ? "+" : ""} ${count === 1 ? "category" : "categories"}`
          : "\u00a0"}
      </span>
      <span className="hidden items-center gap-3 sm:flex">
        <span className="flex items-center gap-1">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd> to move
        </span>
        <span className="flex items-center gap-1">
          <Kbd>
            <CornerDownLeft className="h-3 w-3" />
          </Kbd>
          to select
        </span>
        <span className="flex items-center gap-1">
          <Kbd>Esc</Kbd> to close
        </span>
      </span>
    </div>
  );
}
