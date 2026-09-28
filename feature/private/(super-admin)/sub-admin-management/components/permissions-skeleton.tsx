import { Skeleton } from "@/components/ui/skeleton";

export function PermissionsSkeleton() {
  return (
    <div className="grid gap-4 p-6 sm:grid-cols-2" aria-label="Loading permissions">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="rounded-2xl border p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded-md" />

            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
