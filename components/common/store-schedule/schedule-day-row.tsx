"use client";

import { cn } from "@/lib/utils";
import { AnalogTimePicker } from "@/components/common/analog-time-picker";
import { DAY_ABBR, parseTimeToMinutes, type DailyScheduleItem } from "../store-schedule-utils";
import { type ScheduleTimeField } from "./use-store-schedule";

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

export interface ScheduleDayRowProps {
  item: DailyScheduleItem;
  displayError: string | undefined;
  disabled: boolean;
  onToggleDay: (dayName: string) => void;
  onToggle24Hours: (dayName: string) => void;
  onTimeChange: (dayName: string, field: ScheduleTimeField, newTime: string) => void;
}

export function ScheduleDayRow({
  item,
  displayError,
  disabled,
  onToggleDay,
  onToggle24Hours,
  onTimeChange,
}: ScheduleDayRowProps) {
  const isDayOpen = item.isOpen;
  const { isOpenInvalid, isCloseInvalid, timeSequenceInvalid } = getDayValidation(
    item,
    displayError,
  );

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
