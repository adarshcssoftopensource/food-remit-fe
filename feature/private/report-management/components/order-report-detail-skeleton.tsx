"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function OrderReportDetailSkeleton() {
  return (
    <div className="animate-in fade-in-50 space-y-6 duration-300">
      {/* Navigation Header Skeleton */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-xs backdrop-blur-xl sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-xl" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-48 rounded-md" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-3 w-40 rounded-md" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-28 rounded-xl" />
          <Skeleton className="h-8 w-28 rounded-xl" />
        </div>
      </div>

      {/* 6 KPI Cards Grid Skeleton */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card
            key={i}
            className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900"
          >
            <CardContent className="space-y-2 p-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-20 rounded-md" />
                <Skeleton className="size-7 rounded-lg" />
              </div>
              <Skeleton className="h-7 w-28 rounded-md" />
              <Skeleton className="h-3 w-20 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3-Step Financial Breakdown Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-60 rounded-md" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[1, 2, 3].map((step) => (
            <Card
              key={step}
              className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-800/30">
                <div className="flex items-center gap-2">
                  <Skeleton className="size-6 rounded-full" />
                  <Skeleton className="h-4 w-32 rounded-md" />
                </div>
                <Skeleton className="size-4 rounded-md" />
              </div>
              <div className="space-y-3.5 p-5">
                {[1, 2, 3, 4].map((r) => (
                  <div key={r} className="flex items-center justify-between">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3.5 w-16" />
                  </div>
                ))}
                <hr className="my-2 border-dashed border-slate-200 dark:border-slate-800" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-6 w-28" />
                </div>
                <div className="mt-3 space-y-1.5 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                  <Skeleton className="h-2.5 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Party Details Grid Skeleton: Sender & Receiver */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card
            key={i}
            className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <Skeleton className="h-5 w-36 rounded-md" />
              <Skeleton className="size-7 rounded-lg" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((f) => (
                <div key={f} className="space-y-1">
                  <Skeleton className="h-2.5 w-20" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Items Table Skeleton */}
      <Card className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40 rounded-md" />
          <Skeleton className="h-9 w-60 rounded-xl" />
        </div>
        <div className="space-y-2 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl border border-slate-100 p-3 dark:border-slate-800"
            >
              <Skeleton className="size-10 rounded-xl" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
