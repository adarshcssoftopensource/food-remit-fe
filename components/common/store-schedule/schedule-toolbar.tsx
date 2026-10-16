"use client";

import { Calendar, Check, Copy, Moon, Sparkles, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { type SchedulePreset } from "./use-store-schedule";

interface ScheduleToolbarProps {
  openCount: number;
  disabled: boolean;
  canCopyToAll: boolean;
  sourceDayName?: string;
  isCopied: boolean;
  onApplyPreset: (preset: SchedulePreset) => void;
  onCopyHoursToAllOpen: () => void;
}

export function ScheduleToolbar({
  openCount,
  disabled,
  canCopyToAll,
  sourceDayName,
  isCopied,
  onApplyPreset,
  onCopyHoursToAllOpen,
}: ScheduleToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 pb-2.5">
      <div className="flex items-center gap-1.5">
        <Calendar className="h-4 w-4 text-emerald-600" />
        <span className="text-xs font-semibold text-slate-700">
          Active Days: <span className="font-bold text-emerald-600">{openCount} of 7</span>
        </span>
      </div>

      <div className="grid w-full grid-cols-2 gap-1.5 @md:flex @md:w-auto @md:flex-wrap @md:items-center">
        <button
          type="button"
          onClick={() => onApplyPreset("all")}
          disabled={disabled}
          className="inline-flex h-8 cursor-pointer items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          <Sparkles className="h-3 w-3 text-emerald-500" />
          All 7 Days
        </button>
        <button
          type="button"
          onClick={() => onApplyPreset("weekdays")}
          disabled={disabled}
          className="inline-flex h-8 cursor-pointer items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          <Sun className="h-3 w-3 text-amber-500" />
          Mon – Fri
        </button>
        <button
          type="button"
          onClick={() => onApplyPreset("weekends")}
          disabled={disabled}
          className="inline-flex h-8 cursor-pointer items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          <Moon className="h-3 w-3 text-indigo-500" />
          Sat – Sun
        </button>

        {/* Unified Copy to All button next to Sat – Sun */}
        <button
          type="button"
          onClick={onCopyHoursToAllOpen}
          disabled={disabled || !canCopyToAll}
          title={
            canCopyToAll
              ? `Copy ${sourceDayName}'s hours to all open days`
              : "Set opening & closing hours for at least one day first"
          }
          className={cn(
            "inline-flex h-8 cursor-pointer items-center justify-center gap-1 rounded-lg border px-2.5 text-xs font-medium transition-all",
            isCopied
              ? "border-emerald-500 bg-emerald-50 font-semibold text-emerald-700 shadow-xs"
              : canCopyToAll
                ? "border-emerald-200 bg-emerald-50/70 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100"
                : "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400 opacity-60",
          )}
        >
          {isCopied ? (
            <>
              <Check className="h-3 w-3 text-emerald-600" />
              <span>Copied to all!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 text-emerald-600" />
              <span>Copy to all</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
