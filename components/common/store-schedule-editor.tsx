"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Clock, Copy, Check, Calendar, Sun, Moon, Sparkles } from "lucide-react";
import { AnalogTimePicker } from "@/components/common/analog-time-picker";
import {
  DAYS_OF_WEEK,
  DAY_ABBR,
  formatScheduleSummary,
  parseTimeToMinutes,
  type DailyScheduleItem,
} from "@/components/common/store-schedule-utils";

export type { DailyScheduleItem };

const EMPTY_DAYS_OPEN: string[] = [];

type SchedulePreset = "all" | "weekdays" | "weekends";
type ScheduleTimeField = "openTime" | "closeTime";

interface StoreScheduleEditorProps {
  daysOpen: string[];
  hoursOfOperation: string;
  dailySchedule?: DailyScheduleItem[];
  onChange: (schedule: {
    daysOpen: string[];
    hoursOfOperation: string;
    dailySchedule: DailyScheduleItem[];
  }) => void;
  error?: string;
  disabled?: boolean;
}

function ScheduleToolbar({
  openCount,
  disabled,
  canCopyToAll,
  sourceDayName,
  isCopied,
  onApplyPreset,
  onCopyHoursToAllOpen,
}: {
  openCount: number;
  disabled: boolean;
  canCopyToAll: boolean;
  sourceDayName?: string;
  isCopied: boolean;
  onApplyPreset: (preset: SchedulePreset) => void;
  onCopyHoursToAllOpen: () => void;
}) {
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

function getDayValidation(item: DailyScheduleItem, displayError: string | undefined) {
  const isDayOpen = item.isOpen;
  const is24Hours = item.openTime === "24H";

  const isOpenInvalid = Boolean(
    displayError && isDayOpen && !is24Hours && (!item.openTime || item.openTime === "00:00"),
  );
  let isCloseInvalid = Boolean(
    displayError && isDayOpen && !is24Hours && (!item.closeTime || item.closeTime === "00:00"),
  );

  let timeSequenceInvalid = false;
  if (
    isDayOpen &&
    !is24Hours &&
    item.openTime &&
    item.closeTime &&
    item.openTime !== "00:00" &&
    item.closeTime !== "00:00"
  ) {
    const openMins = parseTimeToMinutes(item.openTime, false);
    const closeMins = parseTimeToMinutes(item.closeTime, true);
    if (closeMins < openMins) {
      timeSequenceInvalid = true;
      isCloseInvalid = true;
    }
  }

  return { isOpenInvalid, isCloseInvalid, timeSequenceInvalid };
}

function ScheduleDayBadge({ item }: { item: DailyScheduleItem }) {
  return (
    <span
      className={cn(
        "flex h-7 w-11 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold tracking-wider uppercase",
        item.isOpen ? "bg-emerald-100/80 text-emerald-800" : "bg-slate-200/80 text-slate-500",
      )}
    >
      {DAY_ABBR[item.day]}
    </span>
  );
}

function ScheduleDayToggles({
  item,
  disabled,
  onToggleDay,
  onToggle24Hours,
  className,
}: {
  item: DailyScheduleItem;
  disabled: boolean;
  onToggleDay: (dayName: string) => void;
  onToggle24Hours: (dayName: string) => void;
  className?: string;
}) {
  const isDayOpen = item.isOpen;
  const is24Hours = item.openTime === "24H";
  const base =
    "inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold shadow-xs transition-all active:scale-95 active:shadow-none";

  return (
    <div className={cn("flex shrink-0 items-center gap-1.5", className)}>
      <button
        type="button"
        onClick={() => onToggleDay(item.day)}
        disabled={disabled}
        aria-pressed={isDayOpen}
        className={cn(
          base,
          "min-w-18",
          isDayOpen
            ? "border-emerald-300 bg-emerald-500 text-white hover:bg-emerald-600"
            : "border-slate-300 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", isDayOpen ? "bg-white" : "bg-slate-400")} />
        {isDayOpen ? "Open" : "Closed"}
      </button>

      <button
        type="button"
        onClick={() => onToggle24Hours(item.day)}
        disabled={disabled || !isDayOpen}
        aria-pressed={is24Hours}
        title={is24Hours ? "Switch to custom hours" : "Set as open 24 hours"}
        className={cn(
          base,
          "min-w-17",
          is24Hours
            ? "border-violet-400 bg-violet-500 text-white hover:bg-violet-600"
            : "border-slate-300 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700",
          !isDayOpen && "invisible",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <span
          className={cn("text-[11px] leading-none", is24Hours ? "text-white" : "text-slate-400")}
        >
          ∞
        </span>
        24 Hrs
      </button>
    </div>
  );
}

function ScheduleDayTimes({
  item,
  disabled,
  isOpenInvalid,
  isCloseInvalid,
  timeSequenceInvalid,
  onTimeChange,
}: {
  item: DailyScheduleItem;
  disabled: boolean;
  isOpenInvalid: boolean;
  isCloseInvalid: boolean;
  timeSequenceInvalid: boolean;
  onTimeChange: (dayName: string, field: ScheduleTimeField, newTime: string) => void;
}) {
  const isDayOpen = item.isOpen;
  const is24Hours = item.openTime === "24H";

  if (!isDayOpen) {
    return (
      <div className="flex h-10 w-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-100/50 px-3 text-xs font-medium text-slate-400">
        Closed all day
      </div>
    );
  }

  if (is24Hours) {
    return (
      <div className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50/60 px-3 text-xs font-semibold text-violet-700">
        <span className="text-base leading-none">∞</span>
        Open 24 hours
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-1">
      <div className="flex w-full items-center gap-2">
        <div className="min-w-0 flex-1">
          <AnalogTimePicker
            value={item.openTime}
            onChange={(t) => onTimeChange(item.day, "openTime", t)}
            placeholder="Opens"
            disabled={disabled}
            invalid={isOpenInvalid || timeSequenceInvalid}
          />
        </div>
        <span className="shrink-0 text-xs font-semibold text-slate-400">to</span>
        <div className="min-w-0 flex-1">
          <AnalogTimePicker
            value={item.closeTime}
            onChange={(t) => onTimeChange(item.day, "closeTime", t)}
            placeholder="Closes"
            disabled={disabled}
            invalid={isCloseInvalid}
          />
        </div>
      </div>
      {timeSequenceInvalid && (
        <p className="px-1 text-[11px] font-medium text-red-500">
          Closing time must be after opening time.
        </p>
      )}
    </div>
  );
}

function ScheduleDayRow({
  item,
  displayError,
  disabled,
  onToggleDay,
  onToggle24Hours,
  onTimeChange,
}: {
  item: DailyScheduleItem;
  displayError: string | undefined;
  disabled: boolean;
  onToggleDay: (dayName: string) => void;
  onToggle24Hours: (dayName: string) => void;
  onTimeChange: (dayName: string, field: ScheduleTimeField, newTime: string) => void;
}) {
  const isDayOpen = item.isOpen;
  const { isOpenInvalid, isCloseInvalid, timeSequenceInvalid } = getDayValidation(
    item,
    displayError,
  );

  // Narrow: day + toggles on top, times below. Wide: everything on one line.
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2.5 transition-colors @lg:flex-nowrap",
        isDayOpen ? "hover:bg-slate-50/50" : "bg-slate-50/60 text-slate-400",
      )}
    >
      <ScheduleDayBadge item={item} />
      <ScheduleDayToggles
        item={item}
        disabled={disabled}
        onToggleDay={onToggleDay}
        onToggle24Hours={onToggle24Hours}
        className="ml-auto @lg:order-last @lg:ml-0"
      />
      <div className="w-full @lg:w-auto @lg:min-w-0 @lg:flex-1">
        <ScheduleDayTimes
          item={item}
          disabled={disabled}
          isOpenInvalid={isOpenInvalid}
          isCloseInvalid={isCloseInvalid}
          timeSequenceInvalid={timeSequenceInvalid}
          onTimeChange={onTimeChange}
        />
      </div>
    </div>
  );
}

export function StoreScheduleEditor({
  daysOpen = EMPTY_DAYS_OPEN,
  hoursOfOperation = "",
  dailySchedule,
  onChange,
  error,
  disabled = false,
}: StoreScheduleEditorProps) {
  const [isCopied, setIsCopied] = React.useState(false);
  const previousTimesRef = React.useRef<Record<string, { open: string; close: string }>>({});

  // Initialize internal state from dailySchedule or fallback to defaults
  const scheduleItems = React.useMemo<DailyScheduleItem[]>(() => {
    if (dailySchedule && Array.isArray(dailySchedule) && dailySchedule.length === 7) {
      return dailySchedule;
    }

    const defaultOpen = "00:00";
    const defaultClose = "00:00";

    return DAYS_OF_WEEK.map((day) => {
      const isOpen = daysOpen.length > 0 ? daysOpen.includes(day) : true;
      return {
        day,
        isOpen,
        openTime: defaultOpen,
        closeTime: defaultClose,
      };
    });
  }, [dailySchedule, daysOpen]);

  const updateSchedule = (newItems: DailyScheduleItem[]) => {
    const updatedDaysOpen = newItems.filter((item) => item.isOpen).map((item) => item.day);
    const summary = formatScheduleSummary(newItems);
    onChange({
      daysOpen: updatedDaysOpen,
      hoursOfOperation: summary,
      dailySchedule: newItems,
    });
  };

  const handleToggleDay = (dayName: string) => {
    if (disabled) return;
    const next = scheduleItems.map((item) => {
      if (item.day === dayName) {
        return {
          ...item,
          isOpen: !item.isOpen,
          openTime: item.openTime || "00:00",
          closeTime: item.closeTime || "00:00",
        };
      }
      return item;
    });
    updateSchedule(next);
  };

  const handleTimeChange = (dayName: string, field: "openTime" | "closeTime", newTime: string) => {
    if (disabled) return;
    const next = scheduleItems.map((item) => {
      if (item.day === dayName) {
        return { ...item, [field]: newTime };
      }
      return item;
    });
    updateSchedule(next);
  };

  const handleToggle24Hours = (dayName: string) => {
    if (disabled) return;
    const next = scheduleItems.map((item) => {
      if (item.day === dayName) {
        const is24H = item.openTime === "24H";
        if (!is24H) {
          previousTimesRef.current[dayName] = { open: item.openTime, close: item.closeTime };
          return {
            ...item,
            openTime: "24H",
            closeTime: "24H",
          };
        } else {
          const prev = previousTimesRef.current[dayName];
          return {
            ...item,
            openTime: prev?.open && prev.open !== "24H" ? prev.open : "00:00",
            closeTime: prev?.close && prev.close !== "24H" ? prev.close : "00:00",
          };
        }
      }
      return item;
    });
    updateSchedule(next);
  };

  // Find first open day with valid opening and closing hours (not 24H)
  const sourceDayWithHours = scheduleItems.find(
    (item) =>
      item.isOpen &&
      item.openTime &&
      item.openTime !== "00:00" &&
      item.openTime !== "24H" &&
      item.closeTime &&
      item.closeTime !== "00:00" &&
      item.closeTime !== "24H",
  );

  const canCopyToAll = Boolean(sourceDayWithHours);

  // Copy configured day hours to all other open days
  const handleCopyHoursToAllOpen = () => {
    if (disabled || !sourceDayWithHours) return;
    const next = scheduleItems.map((item) => {
      if (item.isOpen) {
        return {
          ...item,
          openTime: sourceDayWithHours.openTime,
          closeTime: sourceDayWithHours.closeTime,
        };
      }
      return item;
    });
    updateSchedule(next);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Preset button actions
  const applyPreset = (preset: "all" | "weekdays" | "weekends") => {
    if (disabled) return;
    const next = scheduleItems.map((item) => {
      let isOpen = item.isOpen;
      if (preset === "all") isOpen = true;
      if (preset === "weekdays") {
        isOpen = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(item.day);
      }
      if (preset === "weekends") {
        isOpen = ["Saturday", "Sunday"].includes(item.day);
      }
      return {
        ...item,
        isOpen,
        openTime: item.openTime || "00:00",
        closeTime: item.closeTime || "00:00",
      };
    });
    updateSchedule(next);
  };

  const openCount = scheduleItems.filter((i) => i.isOpen).length;

  const allOpenDaysConfigured = React.useMemo(() => {
    const openItems = scheduleItems.filter((i) => i.isOpen);
    if (openItems.length === 0) return false;
    return openItems.every(
      (item) =>
        item.openTime === "24H" || // 24-hour days are always configured
        (item.openTime &&
          item.closeTime &&
          item.openTime !== "00:00" &&
          item.closeTime !== "00:00"),
    );
  }, [scheduleItems]);

  const displayError = allOpenDaysConfigured ? undefined : error;

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

      {/* Days Rows (clean layout without duplicate copy buttons) */}
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
