"use client";

import { Clock } from "lucide-react";
import { type DailyScheduleItem } from "@/components/common/store-schedule-utils";
import { useStoreSchedule } from "./store-schedule/use-store-schedule";
import { ScheduleToolbar } from "./store-schedule/schedule-toolbar";
import { ScheduleDayRow } from "./store-schedule/schedule-day-row";

export type { DailyScheduleItem };

const EMPTY_DAYS_OPEN: string[] = [];

export interface StoreScheduleEditorProps {
  daysOpen?: string[];
  hoursOfOperation?: string;
  dailySchedule?: DailyScheduleItem[];
  onChange: (schedule: {
    daysOpen: string[];
    hoursOfOperation: string;
    dailySchedule: DailyScheduleItem[];
  }) => void;
  error?: string;
  disabled?: boolean;
}

export function StoreScheduleEditor({
  daysOpen = EMPTY_DAYS_OPEN,
  hoursOfOperation = "",
  dailySchedule,
  onChange,
  error,
  disabled = false,
}: StoreScheduleEditorProps) {
  const {
    scheduleItems,
    openCount,
    isCopied,
    canCopyToAll,
    sourceDayWithHours,
    displayError,
    handleToggleDay,
    handleTimeChange,
    handleToggle24Hours,
    handleCopyHoursToAllOpen,
    applyPreset,
  } = useStoreSchedule({
    daysOpen,
    dailySchedule,
    onChange,
    error,
    disabled,
  });

  return (
    <div className="@container flex flex-col gap-3">
      {/* Quick Presets Toolbar with unified Copy to all button */}
      <ScheduleToolbar
        openCount={openCount}
        disabled={disabled}
        canCopyToAll={canCopyToAll}
        sourceDayName={sourceDayWithHours?.day}
        isCopied={isCopied}
        onApplyPreset={applyPreset}
        onCopyHoursToAllOpen={handleCopyHoursToAllOpen}
      />

      {/* Days Rows */}
      <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-xs">
        {scheduleItems.map((item) => (
          <ScheduleDayRow
            key={item.day}
            item={item}
            displayError={displayError}
            disabled={disabled}
            onToggleDay={handleToggleDay}
            onToggle24Hours={handleToggle24Hours}
            onTimeChange={handleTimeChange}
          />
        ))}
      </div>

      {/* Summary preview */}
      {hoursOfOperation && (
        <div className="flex items-start gap-2 rounded-xl bg-slate-100/60 p-3 text-xs text-slate-600">
          <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
          <div>
            <span className="font-semibold text-slate-700">Schedule Summary: </span>
            <span>{hoursOfOperation}</span>
          </div>
        </div>
      )}

      {/* Error message */}
      {displayError && <p className="text-xs font-medium text-red-500">{displayError}</p>}
    </div>
  );
}
