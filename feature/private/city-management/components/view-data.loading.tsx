import { Skeleton } from "@/components/ui/skeleton";

function ViewDataLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b bg-linear-to-r from-slate-50 via-blue-50 to-indigo-50 p-8 pb-8">
          <div className="flex items-center gap-6">
            <Skeleton className="h-20 w-20 rounded-2xl" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-5 w-48" />
            </div>
            <div className="flex shrink-0 gap-3">
              <div className="space-y-2 text-right">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="w-px bg-slate-200" />
              <div className="space-y-2 text-right">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6 p-8">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default ViewDataLoading;
