import { FilePenLine } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LandingPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>

        <Card className="flex min-h-0 flex-col overflow-hidden rounded-2xl border-slate-200/80 bg-white/95 shadow-sm">
          <div className="from-primary/6 shrink-0 border-b border-slate-100 bg-linear-to-r via-transparent to-emerald-50/40 px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <div className="bg-primary/12 text-primary flex size-8 items-center justify-center rounded-lg">
                <FilePenLine className="size-4" />
              </div>
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
          <CardContent className="min-h-0 flex-1 p-5 sm:p-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-6 w-44" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
