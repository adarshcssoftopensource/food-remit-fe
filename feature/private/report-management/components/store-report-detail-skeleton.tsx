"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StoreReportDetailSkeleton() {
  return (
    <div className="animate-in fade-in-50 space-y-4 duration-300">
      {/* Breadcrumb / PageHeader Skeleton */}
      <div className="flex items-center gap-2 py-1">
        <Skeleton className="h-4 w-28 rounded-md" />
        <span className="text-slate-300 dark:text-slate-700">/</span>
        <Skeleton className="h-4 w-24 rounded-md" />
        <span className="text-slate-300 dark:text-slate-700">/</span>
        <Skeleton className="h-4 w-36 rounded-md" />
      </div>

      {/* Store Banner Card Skeleton */}
      <Card className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="grid items-stretch gap-6 md:grid-cols-12">
          {/* Left: Store Image Skeleton */}
          <div className="flex flex-col md:col-span-5">
            <Skeleton className="h-56 min-h-[220px] w-full rounded-2xl md:h-full" />
          </div>

          {/* Right: Details Skeleton */}
          <div className="flex flex-col justify-between space-y-4 md:col-span-7">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-8 w-52 rounded-xl" />
                  <Skeleton className="h-5 w-16 rounded-md" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>

              {/* 4 contact / location info boxes */}
              <div className="grid gap-2.5 sm:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800/60 dark:bg-slate-800/40"
                  >
                    <Skeleton className="mt-0.5 size-4 shrink-0 rounded-md" />
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <Skeleton className="h-2.5 w-16" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Skeleton className="h-8 w-44 rounded-xl" />
              <Skeleton className="h-8 w-36 rounded-xl" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <CardHeader className="border-b border-slate-100 p-0 pb-3 dark:border-slate-800">
          <Skeleton className="h-5 w-64 rounded-md" />
        </CardHeader>
        <CardContent className="p-0 pt-3">
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800/80 dark:bg-slate-800/50"
              >
                <Skeleton className="size-8 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Skeleton className="h-2.5 w-20" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Orders Table Skeleton Card */}
      <Card className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        {/* Table Title & Count */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-36 rounded-md" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>

        {/* Filter bar skeleton */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-3">
          <Skeleton className="h-9 w-72 rounded-xl" />
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-9 w-52 rounded-xl" />
            <Skeleton className="h-9 w-44 rounded-xl" />
          </div>
        </div>

        {/* Table rows skeleton */}
        <div className="space-y-2.5 pt-2">
          {/* Header row */}
          <div className="flex items-center gap-4 rounded-xl bg-slate-50/80 p-3 dark:bg-slate-800/50">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* 6 Body rows */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
            >
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-4 w-24" />
              <div className="flex items-center gap-2">
                <Skeleton className="size-8 rounded-lg" />
                <Skeleton className="h-3.5 w-24" />
              </div>
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-xl" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
