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
import {
  AlertTriangle,
  CheckCircle2,
  FolderPlus,
  Info,
  PackagePlus,
  RefreshCw,
  XCircle,
} from "lucide-react";

export type CsvImportResult = {
  title: string;
  description?: string;
  createdCount?: number;
  updatedCount?: number;
  categoriesCreated?: number;
  errors?: string[];
  warnings?: string[];
  isError?: boolean;
};

type CsvImportResultDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: CsvImportResult | null;
  onRetry?: () => void;
};

export function CsvImportResultDialog({
  open,
  onOpenChange,
  result,
  onRetry,
}: CsvImportResultDialogProps) {
  if (!result) return null;

  const errors = result.errors || [];
  const warnings = result.warnings || [];
  const isError = !!result.isError;

  const tone = isError
    ? {
        banner: "from-red-500/15 via-rose-500/10 to-transparent",
        iconWrap: "bg-red-500/15 text-red-600 ring-red-500/20",
        Icon: XCircle,
        accent: "text-red-700 dark:text-red-400",
      }
    : {
        banner: "from-emerald-500/15 via-teal-500/10 to-transparent",
        iconWrap: "bg-emerald-500/15 text-emerald-600 ring-emerald-500/20",
        Icon: CheckCircle2,
        accent: "text-emerald-700 dark:text-emerald-400",
      };
  const StatusIcon = tone.Icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl overflow-hidden rounded-2xl p-0 sm:max-w-xl">
        <div className={cn("bg-linear-to-br px-6 pt-6 pb-4", tone.banner)}>
          <DialogHeader className="gap-3 text-left">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-xl ring-1",
                  tone.iconWrap,
                )}
              >
                <StatusIcon className="size-5" />
              </div>
              <div className="min-w-0 space-y-1">
                <DialogTitle className={cn("text-lg font-bold tracking-tight", tone.accent)}>
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
          {isError ? (
            <SummaryStat
              icon={<AlertTriangle className="size-3.5" />}
              label="Problems to fix"
              value={errors.length}
              tone="rose"
            />
          ) : (
            <div className="grid grid-cols-3 gap-2.5">
              <SummaryStat
                icon={<PackagePlus className="size-3.5" />}
                label="Added"
                value={result.createdCount ?? 0}
                tone="emerald"
              />
              <SummaryStat
                icon={<RefreshCw className="size-3.5" />}
                label="Updated"
                value={result.updatedCount ?? 0}
                tone="sky"
              />
              <SummaryStat
                icon={<FolderPlus className="size-3.5" />}
                label="New categories"
                value={result.categoriesCreated ?? 0}
                tone="violet"
              />
            </div>
          )}

          {errors.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-red-200/80 bg-red-50/80 dark:border-red-900/40 dark:bg-red-950/25">
              <div className="border-b border-red-200/80 px-3.5 py-2 dark:border-red-900/40">
                <p className="text-xs font-semibold text-red-700 dark:text-red-300">
                  Fix these rows in your file, then import it again
                </p>
              </div>
              <ul className="max-h-64 space-y-1.5 overflow-y-auto px-3.5 py-3">
                {errors.map((error, index) => (
                  <li
                    key={`${index}-${error}`}
                    className="flex gap-2 rounded-lg bg-white/70 px-2.5 py-2 text-xs leading-5 text-red-800 dark:bg-red-950/40 dark:text-red-200"
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-red-400" />
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {warnings.length > 0 && (
            <div className="space-y-1.5 rounded-xl border border-amber-200/80 bg-amber-50/70 px-3.5 py-3 dark:border-amber-900/40 dark:bg-amber-950/20">
              {warnings.map((warning) => (
                <p
                  key={warning}
                  className="flex gap-2 text-xs leading-5 text-amber-800 dark:text-amber-200"
                >
                  <Info className="mt-0.5 size-3.5 shrink-0" />
                  {warning}
                </p>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
          {isError && onRetry && (
            <Button
              variant="outline"
              className="rounded-xl px-5"
              onClick={() => {
                onOpenChange(false);
                onRetry();
              }}
            >
              Choose another file
            </Button>
          )}
          <Button className="rounded-xl px-5" onClick={() => onOpenChange(false)}>
            {isError ? "Close" : "Done"}
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
