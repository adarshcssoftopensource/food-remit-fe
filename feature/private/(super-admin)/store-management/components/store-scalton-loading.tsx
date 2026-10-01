import { Skeleton } from "@/components/ui/skeleton";
import { ViewHeroSkeleton } from "@/feature/private/(super-admin)/city-management/components/shared/view-hero-skeleton";

function StoreScaltonLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <ViewHeroSkeleton />
        <div className="grid md:grid-cols-2">
          <div className="space-y-6 border-r border-slate-100 p-8">
            <Skeleton className="h-8 w-48" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="space-y-6 p-8">
            <Skeleton className="h-8 w-48" />
            <div className="mb-6 flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoreScaltonLoading;
