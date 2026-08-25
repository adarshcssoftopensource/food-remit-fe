import { CircleHelp } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function FaqSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-11 w-32 rounded-xl" />
      </div>

      <Card className="overflow-hidden rounded-2xl border-slate-200/80 shadow-sm">
        <CardHeader className="from-primary/8 border-b bg-linear-to-r via-emerald-50/40 to-transparent">
          <div className="flex items-center gap-3">
            <div className="bg-primary/15 text-primary flex size-10 items-center justify-center rounded-xl">
              <CircleHelp className="size-5" />
            </div>
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 border-b border-slate-100 pb-4 last:border-0"
              >
                <Skeleton className="h-10 w-10 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20 rounded-lg" />
                  <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
