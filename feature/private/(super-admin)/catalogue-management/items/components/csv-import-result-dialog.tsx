"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, FolderPlus, PackagePlus, XCircle } from "lucide-react";

export type CsvImportResult = {
  title: string;
  description?: string;
  successCount?: number;
  errorCount?: number;
  departmentsCreated?: number;
  categoriesCreated?: number;
  errors?: string[];
  isError?: boolean;
};

type CsvImportResultDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: CsvImportResult | null;
};

export function CsvImportResultDialog({ open, onOpenChange, result }: CsvImportResultDialogProps) {
  if (!result) return null;

  const errors = result.errors || [];
  const isError = Boolean(
    result.isError || (result.errorCount && result.errorCount > 0 && !result.successCount),
  );
  const isPartial = Boolean(
    !isError &&
    result.errorCount &&
    result.errorCount > 0 &&
    result.successCount &&
    result.successCount > 0,
  );

  const tone = isError ? "error" : isPartial ? "warning" : "success";

  const toneStyles = {
    success: {
      banner: "from-emerald-500/15 via-teal-500/10 to-transparent",
      iconWrap: "bg-emerald-500/15 text-emerald-600 ring-emerald-500/20",
      Icon: CheckCircle2,
      accent: "text-emerald-700 dark:text-emerald-400",
    },
    warning: {
      banner: "from-amber-500/15 via-orange-500/10 to-transparent",
      iconWrap: "bg-amber-500/15 text-amber-600 ring-amber-500/20",
      Icon: AlertTriangle,
      accent: "text-amber-700 dark:text-amber-400",
    },
    error: {
      banner: "from-red-500/15 via-rose-500/10 to-transparent",
      iconWrap: "bg-red-500/15 text-red-600 ring-red-500/20",
      Icon: XCircle,
      accent: "text-red-700 dark:text-red-400",
    },
  }[tone];

  const StatusIcon = toneStyles.Icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg overflow-hidden rounded-2xl p-0 sm:max-w-lg">
        <div className={cn("bg-linear-to-br px-6 pt-6 pb-4", toneStyles.banner)}>
          <DialogHeader className="gap-3 text-left">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-xl ring-1",
                  toneStyles.iconWrap,
                )}
              >
                <StatusIcon className="size-5" />
              </div>
              <div className="min-w-0 space-y-1">
                <DialogTitle className={cn("text-lg font-bold tracking-tight", toneStyles.accent)}>
                  {result.title}
                </DialogTitle>
                {result.description ? (
                  <DialogDescription className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {result.description}
                  </DialogDescription>
                ) : null}
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="space-y-4 px-6 pb-2">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <SummaryStat
              icon={<PackagePlus className="size-3.5" />}
              label="Imported"
              value={result.successCount ?? 0}
              tone="emerald"
            />
            <SummaryStat
              icon={<FolderPlus className="size-3.5" />}
              label="Departments"
              value={result.departmentsCreated ?? 0}
              tone="sky"
            />
            <SummaryStat
              icon={<FolderPlus className="size-3.5" />}
              label="Categories"
              value={result.categoriesCreated ?? 0}
              tone="violet"
            />
            <SummaryStat
              icon={<AlertTriangle className="size-3.5" />}
              label="Failed"
              value={result.errorCount ?? errors.length}
              tone="rose"
            />
          </div>

          {errors.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-red-200/80 bg-red-50/80 dark:border-red-900/40 dark:bg-red-950/25">
              <div className="border-b border-red-200/80 px-3.5 py-2 dark:border-red-900/40">
                <p className="text-xs font-bold tracking-wide text-red-700 uppercase dark:text-red-300">
                  Validation errors ({errors.length})
                </p>
              </div>
              <div className="max-h-56 space-y-1.5 overflow-y-auto px-3.5 py-3">
                {errors.map((error, index) => (
                  <div
                    key={`${index}-${error}`}
                    className="flex gap-2 rounded-lg bg-white/70 px-2.5 py-2 text-xs leading-5 text-red-800 dark:bg-red-950/40 dark:text-red-200"
                  >
                    <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-red-400" />
                    <span>{error}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-slate-100 px-6 py-4 dark:border-slate-800">
          <Button className="rounded-xl px-5" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SummaryStat({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: "emerald" | "sky" | "violet" | "rose";
}) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    sky: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
    violet: "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
    rose: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
  };

  return (
    <div className={cn("rounded-xl px-3 py-2.5", tones[tone])}>
      <div className="mb-1 flex items-center gap-1 opacity-80">
        {icon}
        <span className="text-[10px] font-bold tracking-wider uppercase">{label}</span>
      </div>
      <p className="text-xl font-black tracking-tight">{value}</p>
    </div>
  );
}
