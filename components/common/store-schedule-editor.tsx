"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Clock, Copy, Check, Calendar, Sun, Moon, Sparkles } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface DailyScheduleItem {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const DAY_ABBR: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

export const DEFAULT_WEEKLY_SCHEDULE: DailyScheduleItem[] = [
  { day: "Monday", isOpen: true, openTime: "00:00", closeTime: "00:00" },
  { day: "Tuesday", isOpen: true, openTime: "00:00", closeTime: "00:00" },
  { day: "Wednesday", isOpen: true, openTime: "00:00", closeTime: "00:00" },
  { day: "Thursday", isOpen: true, openTime: "00:00", closeTime: "00:00" },
  { day: "Friday", isOpen: true, openTime: "00:00", closeTime: "00:00" },
  { day: "Saturday", isOpen: true, openTime: "00:00", closeTime: "00:00" },
  { day: "Sunday", isOpen: true, openTime: "00:00", closeTime: "00:00" },
];

export function formatScheduleSummary(schedule: DailyScheduleItem[]): string {
  const openDays = schedule.filter(
    (d) =>
      d.isOpen && d.openTime && d.closeTime && d.openTime !== "00:00" && d.closeTime !== "00:00",
  );
  if (openDays.length === 0) return "";

  // If some open days are still not selected, do not show incomplete summary
  const totalOpenDays = schedule.filter((d) => d.isOpen);
  if (openDays.length < totalOpenDays.length) {
    return "";
  }

  // Group days with identical operating hours
  const groups: { timeKey: string; days: string[] }[] = [];
  for (const item of openDays) {
    const timeKey = `${item.openTime} - ${item.closeTime}`;
    const existing = groups.find((g) => g.timeKey === timeKey);
    if (existing) {
      existing.days.push(item.day);
    } else {
      groups.push({ timeKey, days: [item.day] });
    }
  }

  const formatDaysList = (days: string[]) => {
    const sorted = [...days].sort(
      (a, b) => DAYS_OF_WEEK.indexOf(a as any) - DAYS_OF_WEEK.indexOf(b as any),
    );
    if (sorted.length === 7) return "Mon - Sun";
    if (sorted.length === 5 && sorted[0] === "Monday" && sorted[4] === "Friday") return "Mon - Fri";
    if (sorted.length === 2 && sorted[0] === "Saturday" && sorted[1] === "Sunday")
      return "Sat - Sun";

    const indices = sorted.map((d) => DAYS_OF_WEEK.indexOf(d as any));
    let isConsecutive = true;
    for (let i = 1; i < indices.length; i++) {
      if (indices[i] !== indices[i - 1] + 1) {
        isConsecutive = false;
        break;
      }
    }

    if (isConsecutive && sorted.length >= 3) {
      return `${DAY_ABBR[sorted[0]]} - ${DAY_ABBR[sorted[sorted.length - 1]]}`;
    }

    return sorted.map((d) => DAY_ABBR[d] || d).join(", ");
  };

  return groups.map((g) => `${formatDaysList(g.days)}: ${g.timeKey}`).join(", ");
}

const COMMON_TIME_PRESETS = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "05:00 PM",
  "06:00 PM",
  "08:00 PM",
  "09:00 PM",
  "10:00 PM",
  "11:00 PM",
  "12:00 AM",
];

export function AnalogTimePicker({
  value,
  onChange,
  placeholder = "00:00",
  invalid,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [view, setView] = React.useState<"hours" | "minutes">("hours");

  const isSelected = Boolean(
    value && value !== "00:00" && value.includes(" ") && value.includes(":"),
  );

  const defaultHour = placeholder?.toLowerCase().includes("close") ? 10 : 9;
  const defaultAmPm = placeholder?.toLowerCase().includes("close") ? "PM" : "AM";

  const parsedHour = isSelected ? parseInt(value.substring(0, 2), 10) : defaultHour;
  const parsedMinute = isSelected ? parseInt(value.substring(3, 5), 10) : 0;
  const parsedAmPm = isSelected ? value.substring(6, 8) : defaultAmPm;

  const [selectedHour, setSelectedHour] = React.useState(parsedHour);
  const [selectedMinute, setSelectedMinute] = React.useState(parsedMinute);
  const [selectedAmPm, setSelectedAmPm] = React.useState(parsedAmPm);

  const handleOpenChange = (open: boolean) => {
    if (disabled) return;
    setIsOpen(open);
    if (open) {
      setView("hours");
      setSelectedHour(isSelected ? parseInt(value.substring(0, 2), 10) : defaultHour);
      setSelectedMinute(isSelected ? parseInt(value.substring(3, 5), 10) : 0);
      setSelectedAmPm(isSelected ? value.substring(6, 8) : defaultAmPm);
    }
  };

  const clockRef = React.useRef<HTMLDivElement>(null);

  const updateTime = (h: number, m: number, a: string) => {
    setSelectedHour(h);
    setSelectedMinute(m);
    setSelectedAmPm(a);
    const hh = h.toString().padStart(2, "0");
    const mm = m.toString().padStart(2, "0");
    onChange(`${hh}:${mm} ${a}`);
  };

  const handleClockInteract = (e: React.MouseEvent | React.TouchEvent) => {
    if (!clockRef.current) return;
    const rect = clockRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const x = clientX - rect.left - rect.width / 2;
    const y = clientY - rect.top - rect.height / 2;

    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    if (view === "hours") {
      let h = Math.round(angle / 30);
      if (h === 0) h = 12;
      updateTime(h, selectedMinute, selectedAmPm);
    } else {
      let m = Math.round(angle / 6);
      if (m === 60) m = 0;
      updateTime(selectedHour, m, selectedAmPm);
    }
  };

  const handleDrag = (e: any) => {
    if (e.buttons !== 1 && e.type !== "touchmove") return;
    handleClockInteract(e);
  };

  const handleMouseUp = () => {
    if (view === "hours") {
      setView("minutes");
    } else {
      setIsOpen(false);
    }
  };

  const renderNumbers = () => {
    const radius = 95;
    const items = [];
    if (view === "hours") {
      for (let i = 1; i <= 12; i++) {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        const isCurrentSelected = selectedHour === i || (selectedHour === 12 && i === 12);
        items.push(
          <div
            key={`h-${i}`}
            className={cn(
              "absolute -mt-4 -ml-4 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all",
              isCurrentSelected
                ? "z-10 scale-110 bg-emerald-600 font-bold text-white shadow-md"
                : "z-0 text-slate-700 hover:bg-emerald-50",
            )}
            style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
          >
            {i}
          </div>,
        );
      }
    } else {
      for (let i = 0; i < 60; i += 5) {
        const angle = (i * 6 - 90) * (Math.PI / 180);
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        const isCurrentSelected = selectedMinute === i;
        items.push(
          <div
            key={`m-${i}`}
            className={cn(
              "absolute -mt-4 -ml-4 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all",
              isCurrentSelected
                ? "z-10 scale-110 bg-emerald-600 font-bold text-white shadow-md"
                : "z-0 text-slate-700 hover:bg-emerald-50",
            )}
            style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
          >
            {i.toString().padStart(2, "0")}
          </div>,
        );
      }
    }
    return items;
  };

  const getHandRotation = () => {
    return view === "hours" ? selectedHour * 30 : selectedMinute * 6;
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        type="button"
        disabled={disabled}
        className={cn(
          "group flex h-10 w-full cursor-pointer items-center justify-between gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium transition-all hover:border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 sm:text-sm",
          invalid && "border-red-400 bg-red-50/20 text-red-600",
          !isSelected && !invalid && "font-normal text-slate-400",
          isSelected && "font-medium text-slate-800",
        )}
      >
        <span className="flex items-center gap-1.5 truncate">
          <Clock
            className={cn(
              "h-3.5 w-3.5 shrink-0 transition-colors",
              invalid
                ? "text-red-500"
                : isSelected
                  ? "text-emerald-600"
                  : "text-slate-400 group-hover:text-emerald-600",
            )}
          />
          <span className="truncate">{isSelected ? value : placeholder}</span>
        </span>
      </PopoverTrigger>

      <PopoverContent
        className="w-80 rounded-2xl border-slate-200 bg-white p-4 shadow-xl"
        align="center"
      >
        <div className="flex w-full flex-col items-center">
          {/* Digital Time Header */}
          <div className="mb-4 flex w-full flex-col items-center rounded-xl border border-slate-100 bg-slate-50/80 p-3">
            <div className="flex items-center justify-center gap-1 text-4xl font-extrabold tracking-tight text-slate-800">
              <button
                type="button"
                onClick={() => setView("hours")}
                className={cn(
                  "cursor-pointer rounded-lg px-2 py-0.5 transition-colors hover:text-emerald-600",
                  view === "hours" && "bg-emerald-100/60 text-emerald-700",
                )}
              >
                {selectedHour.toString().padStart(2, "0")}
              </button>
              <span className="-mx-1 pb-1 text-slate-300">:</span>
              <button
                type="button"
                onClick={() => setView("minutes")}
                className={cn(
                  "cursor-pointer rounded-lg px-2 py-0.5 transition-colors hover:text-emerald-600",
                  view === "minutes" && "bg-emerald-100/60 text-emerald-700",
                )}
              >
                {selectedMinute.toString().padStart(2, "0")}
              </button>
            </div>

            {/* AM / PM Toggle */}
            <div className="mt-2.5 flex w-full max-w-36 items-center rounded-lg bg-slate-200/60 p-1">
              <button
                type="button"
                onClick={() => updateTime(selectedHour, selectedMinute, "AM")}
                className={cn(
                  "flex-1 cursor-pointer rounded-md py-1 text-xs font-bold transition-all",
                  selectedAmPm === "AM"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800",
                )}
              >
                AM
              </button>
              <button
                type="button"
                onClick={() => updateTime(selectedHour, selectedMinute, "PM")}
                className={cn(
                  "flex-1 cursor-pointer rounded-md py-1 text-xs font-bold transition-all",
                  selectedAmPm === "PM"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800",
                )}
              >
                PM
              </button>
            </div>
          </div>

          {/* Analog Clock Dial */}
          <div className="flex w-full touch-none justify-center select-none">
            <div
              ref={clockRef}
              className="relative h-60 w-60 cursor-pointer rounded-full border border-slate-100 bg-slate-50 shadow-inner"
              onMouseDown={handleClockInteract}
              onMouseMove={handleDrag}
              onMouseUp={handleMouseUp}
              onTouchStart={handleClockInteract}
              onTouchMove={handleDrag}
              onTouchEnd={handleMouseUp}
            >
              <div className="absolute top-1/2 left-1/2 z-20 -mt-[4px] -ml-[4px] h-2 w-2 rounded-full bg-emerald-600"></div>

              <div
                className="absolute bottom-1/2 left-1/2 z-10 w-[2px] origin-bottom rounded-t-full bg-emerald-500 transition-transform duration-300 ease-out"
                style={{
                  height: "90px",
                  transform: `translateX(-50%) rotate(${getHandRotation()}deg)`,
                }}
              >
                <div className="absolute -top-3.5 -left-3.5 h-7 w-7 rounded-full border-[2.5px] border-emerald-500 bg-emerald-400/20"></div>
              </div>

              {renderNumbers()}
            </div>
          </div>

          {/* Quick Presets */}
          <div className="mt-3 flex w-full flex-wrap justify-center gap-1 border-t border-slate-100 pt-2.5">
            {COMMON_TIME_PRESETS.slice(0, 6).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  const [time, ap] = preset.split(" ");
                  const [h, m] = time.split(":").map(Number);
                  updateTime(h, m, ap);
                  setIsOpen(false);
                }}
                className={cn(
                  "cursor-pointer rounded-md px-1.5 py-0.5 text-[11px] font-medium transition-colors",
                  value === preset
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                )}
              >
                {preset}
              </button>
            ))}
          </div>

          <div className="mt-3 flex w-full justify-end">
            <button
              type="button"
              onClick={() => {
                if (!isSelected) {
                  updateTime(selectedHour, selectedMinute, selectedAmPm);
                }
                setIsOpen(false);
              }}
              className="cursor-pointer rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Done
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

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

export function StoreScheduleEditor({
  daysOpen = [],
  hoursOfOperation = "",
  dailySchedule,
  onChange,
  error,
  disabled = false,
}: StoreScheduleEditorProps) {
  const [copiedDay, setCopiedDay] = React.useState<string | null>(null);

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

  // Copy one day's opening and closing hours to all other open days
  const handleCopyHoursToAllOpen = (sourceDay: DailyScheduleItem) => {
    if (
      disabled ||
      !sourceDay.openTime ||
      sourceDay.openTime === "00:00" ||
      !sourceDay.closeTime ||
      sourceDay.closeTime === "00:00"
    ) {
      return;
    }
    const next = scheduleItems.map((item) => {
      if (item.isOpen) {
        return {
          ...item,
          openTime: sourceDay.openTime,
          closeTime: sourceDay.closeTime,
        };
      }
      return item;
    });
    updateSchedule(next);
    setCopiedDay(sourceDay.day);
    setTimeout(() => setCopiedDay(null), 1800);
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
    return (
      openItems.length > 0 &&
      openItems.every(
        (i) => i.openTime && i.closeTime && i.openTime !== "00:00" && i.closeTime !== "00:00",
      )
    );
  }, [scheduleItems]);

  const displayError = allOpenDaysConfigured ? undefined : error;

  return (
    <div className="flex flex-col gap-3">
      {/* Quick Presets Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-emerald-600" />
          <span className="text-xs font-semibold text-slate-700">
            Active Days: <span className="font-bold text-emerald-600">{openCount} of 7</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => applyPreset("all")}
            disabled={disabled}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <Sparkles className="h-3 w-3 text-emerald-500" />
            All 7 Days
          </button>
          <button
            type="button"
            onClick={() => applyPreset("weekdays")}
            disabled={disabled}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <Sun className="h-3 w-3 text-amber-500" />
            Mon – Fri
          </button>
          <button
            type="button"
            onClick={() => applyPreset("weekends")}
            disabled={disabled}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <Moon className="h-3 w-3 text-indigo-500" />
            Sat – Sun
          </button>
        </div>
      </div>

      {/* Days Rows */}
      <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-xs">
        {scheduleItems.map((item) => {
          const isCopied = copiedDay === item.day;
          const isDayOpen = item.isOpen;
          const isOpenInvalid = Boolean(
            displayError && isDayOpen && (!item.openTime || item.openTime === "00:00"),
          );
          const isCloseInvalid = Boolean(
            displayError && isDayOpen && (!item.closeTime || item.closeTime === "00:00"),
          );

          return (
            <div
              key={item.day}
              className={cn(
                "flex flex-col gap-2.5 p-3 transition-colors sm:flex-row sm:items-center sm:justify-between sm:gap-4",
                isDayOpen ? "bg-white hover:bg-slate-50/40" : "bg-slate-50/60 text-slate-400",
              )}
            >
              {/* Left: Day Abbr & Open/Closed Status Toggle */}
              <div className="flex items-center justify-between sm:w-40 sm:shrink-0 sm:justify-start sm:gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-7.5 w-12 items-center justify-center rounded-lg text-xs font-bold tracking-wider uppercase",
                      isDayOpen
                        ? "bg-emerald-100/80 text-emerald-800"
                        : "bg-slate-200/80 text-slate-500",
                    )}
                  >
                    {DAY_ABBR[item.day]}
                  </span>
                </div>

                {/* Open / Closed Toggle Badge */}
                <button
                  type="button"
                  onClick={() => handleToggleDay(item.day)}
                  disabled={disabled}
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all",
                    isDayOpen
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 hover:bg-emerald-100"
                      : "bg-slate-200/70 text-slate-600 hover:bg-slate-300/80",
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      isDayOpen ? "bg-emerald-500" : "bg-slate-400",
                    )}
                  />
                  {isDayOpen ? "Open" : "Closed"}
                </button>
              </div>

              {/* Middle: Open & Close Time Pickers OR Closed Message */}
              <div className="flex flex-1 items-center gap-2">
                {isDayOpen ? (
                  <div className="flex w-full items-center gap-2">
                    <div className="flex-1">
                      <AnalogTimePicker
                        value={item.openTime}
                        onChange={(t) => handleTimeChange(item.day, "openTime", t)}
                        placeholder="00:00"
                        disabled={disabled}
                        invalid={isOpenInvalid}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-400 sm:text-sm">to</span>
                    <div className="flex-1">
                      <AnalogTimePicker
                        value={item.closeTime}
                        onChange={(t) => handleTimeChange(item.day, "closeTime", t)}
                        placeholder="00:00"
                        disabled={disabled}
                        invalid={isCloseInvalid}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex h-10 w-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-100/50 px-3 text-xs font-medium text-slate-400">
                    Closed all day
                  </div>
                )}
              </div>

              {/* Right: Quick Copy to all days */}
              {isDayOpen && (
                <div className="flex sm:w-28 sm:shrink-0 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => handleCopyHoursToAllOpen(item)}
                    disabled={
                      disabled ||
                      !item.openTime ||
                      item.openTime === "00:00" ||
                      !item.closeTime ||
                      item.closeTime === "00:00"
                    }
                    title="Apply these hours to all open days"
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-1 text-xs font-medium transition-all disabled:cursor-not-allowed disabled:opacity-40",
                      isCopied
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800",
                    )}
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy to all</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
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
