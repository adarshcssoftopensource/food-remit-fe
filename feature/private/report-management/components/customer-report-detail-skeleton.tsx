import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CustomerReportDetailSkeleton() {
  return (
    <div className="animate-in fade-in-50 space-y-5 duration-300">
      {/* Breadcrumb / PageHeader Skeleton */}
      <div className="flex items-center gap-2 py-1">
        <Skeleton className="h-4 w-28 rounded-md" />
        <span className="text-slate-300 dark:text-slate-700">/</span>
        <Skeleton className="h-4 w-28 rounded-md" />
        <span className="text-slate-300 dark:text-slate-700">/</span>
        <Skeleton className="h-4 w-36 rounded-md" />
      </div>

      {/* Customer Profile Banner Card Skeleton */}
      <Card className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          {/* Avatar Skeleton */}
          <div className="flex shrink-0 items-center justify-center">
            <Skeleton className="size-24 rounded-2xl md:size-28" />
          </div>

          {/* Details Skeleton */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-56 rounded-xl" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <Skeleton className="h-6 w-32 rounded-md" />
            </div>

            {/* Info Grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800/60 dark:bg-slate-800/40"
                >
                  <Skeleton className="size-8 shrink-0 rounded-lg" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Stats Grid Skeleton */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card
            key={i}
            className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-7 w-16" />
              </div>
              <Skeleton className="size-10 rounded-xl" />
            </div>
          </Card>
        ))}
      </div>

      {/* Orders Table Skeleton Card */}
      <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-6 w-40 rounded-md" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>

        {/* Filter bar skeleton */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-4">
          <Skeleton className="h-9 w-72 rounded-xl" />
        </div>

        {/* Table Rows Skeleton */}
        <div className="space-y-2.5">
          <Skeleton className="h-10 w-full rounded-xl" />
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 px-4 py-3 dark:border-slate-800/80"
            >
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="size-8 rounded-full" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
