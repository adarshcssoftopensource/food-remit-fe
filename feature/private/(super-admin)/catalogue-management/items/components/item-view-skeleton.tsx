import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ItemViewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-8 w-64 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>

      <div className="grid items-stretch gap-6 lg:grid-cols-3">
        <Card className="animate-pulse overflow-hidden border-slate-200/80 lg:col-span-1 dark:border-slate-800">
          <div className="h-28 bg-slate-200 dark:bg-slate-800" />
          <div className="px-6 pt-0 pb-6 text-center">
            <div className="mx-auto -mt-12 h-56 w-56 rounded-[2.5rem] bg-slate-300 ring-4 ring-white dark:bg-slate-700 dark:ring-slate-950" />
            <div className="mx-auto mt-6 h-6 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="mx-auto mt-3 h-4 w-1/2 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="mx-auto mt-4 h-6 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />

            <div className="mt-8 border-t border-slate-100/80 pt-6 text-left dark:border-slate-800/80">
              <div className="mb-4 h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-14 w-14 rounded-xl bg-slate-200 dark:bg-slate-800" />
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100/80 pt-6 text-left dark:border-slate-800/80">
              <div className="mb-4 h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="flex flex-wrap gap-2">
                {[1, 2].map((i) => (
                  <div key={i} className="h-14 w-14 rounded-xl bg-slate-200 dark:bg-slate-800" />
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="flex animate-pulse flex-col border-slate-200/80 lg:col-span-2 dark:border-slate-800">
          <CardHeader className="h-16 border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/20" />
          <CardContent className="flex flex-1 flex-col p-6">
            <div className="grid flex-1 auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800/50" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
