import { FileText } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ContentPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-11 w-32 rounded-xl" />
      </div>

      <Card className="overflow-hidden rounded-2xl border-slate-200/80 shadow-sm">
        <CardHeader className="from-primary/8 border-b bg-linear-to-r via-emerald-50/40 to-transparent py-5">
          <div className="flex items-center gap-3">
            <div className="bg-primary/15 text-primary flex size-11 items-center justify-center rounded-xl">
              <FileText className="size-5" />
            </div>
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
