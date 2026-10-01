import { Skeleton } from "@/components/ui/skeleton";

export function ViewHeroSkeleton() {
  return (
    <div className="border-b border-emerald-100/60 bg-linear-to-r from-emerald-50/70 via-teal-50/30 to-emerald-50/40 p-8 pb-8">
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
  );
}
