"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function EmployeeViewSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="h-100 w-full rounded-3xl" />
    </div>
  );
}
