import { Skeleton } from "@/components/ui/skeleton";

export function PartnerLeadDetailSkeleton() {
  return (
    <div>
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-8 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-9 w-80" />
            <Skeleton className="h-5 w-64" />
          </div>
        </div>
        <Skeleton className="h-11 w-40 rounded-[1.25rem]" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-40" />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="col-span-2 space-y-2">
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-44" />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-36" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="col-span-2 space-y-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-4 w-56" />
            </div>
            <div className="col-span-2 space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-36" />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            <div className="space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="col-span-2 space-y-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-36" />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
