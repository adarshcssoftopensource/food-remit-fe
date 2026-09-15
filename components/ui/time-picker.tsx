"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface TimePickerProps {
  value?: string; // "HH:mm" (24-hour, e.g. "09:30", "23:59")
  onChange?: (val: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

// Convert "HH:mm" 24h to 12h object
function parse24To12(timeStr?: string): {
  hour: number;
  minute: number;
  period: "AM" | "PM";
} {
  if (!timeStr) return { hour: 12, minute: 0, period: "AM" };
  const parts = timeStr.split(":");
  let h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) || 0;
  if (isNaN(h)) h = 0;
  const period: "AM" | "PM" = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return { hour, minute: m, period };
}

// Convert 12h object to "HH:mm" 24h
function format12To24(hour: number, minute: number, period: "AM" | "PM"): string {
  let h = hour;
  if (period === "AM") {
    if (h === 12) h = 0;
  } else {
    if (h !== 12) h += 12;
  }
  return `${h.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}

export function TimePicker({
  value,
  onChange,
  placeholder = "Select time",
  className,
  disabled = false,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const { hour, minute, period } = React.useMemo(() => parse24To12(value), [value]);

  const displayLabel = React.useMemo(() => {
    if (!value) return placeholder;
    const { hour: h, minute: m, period: p } = parse24To12(value);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${p}`;
  }, [value, placeholder]);

  const handleHourChange = (newHour: number) => {
    const time24 = format12To24(newHour, minute, period);
    onChange?.(time24);
  };

  const handleMinuteChange = (newMinute: number) => {
    const time24 = format12To24(hour, newMinute, period);
    onChange?.(time24);
  };

  const handlePeriodChange = (newPeriod: "AM" | "PM") => {
    const time24 = format12To24(hour, minute, newPeriod);
    onChange?.(time24);
  };

  const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 59];

  const presets = [
    { label: "12:00 AM (Midnight)", val: "00:00" },
    { label: "09:00 AM (Morning)", val: "09:00" },
    { label: "12:00 PM (Noon)", val: "12:00" },
    { label: "06:00 PM (Evening)", val: "18:00" },
    { label: "11:59 PM (End of Day)", val: "23:59" },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "flex h-10 w-full min-w-0 items-center justify-start rounded-xl border border-slate-200/80 bg-white/70 px-2.5 py-2 text-xs font-normal text-slate-800 shadow-xs backdrop-blur-md transition-all hover:border-slate-300 sm:px-3 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200",
              !value && "text-slate-400 dark:text-slate-500",
              className,
            )}
          >
            <Clock className="mr-1.5 size-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
            <span className="min-w-0 flex-1 truncate text-left font-medium">{displayLabel}</span>
          </Button>
        }
      />
      <PopoverContent
        align="start"
        className="w-72 rounded-2xl border-slate-200/90 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900"
      >
        {/* Active time banner */}
        <div className="mb-3 flex items-center justify-between rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Clock className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Selected Time</span>
          </div>
          <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
            {displayLabel}
          </span>
        </div>

        {/* Hour, Minute, Period columns */}
        <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
          {/* Hours */}
          <div className="space-y-1">
            <span className="block text-center text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Hour
            </span>
            <div className="max-h-36 scrollbar-thin space-y-0.5 overflow-y-auto pr-0.5">
              {hours.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => handleHourChange(h)}
                  className={cn(
                    "w-full cursor-pointer rounded-lg py-1 text-center font-mono text-xs transition-colors",
                    hour === h
                      ? "bg-emerald-600 font-bold text-white shadow-xs"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                  )}
                >
                  {h.toString().padStart(2, "0")}
                </button>
              ))}
            </div>
          </div>

          {/* Minutes */}
          <div className="space-y-1">
            <span className="block text-center text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Min
            </span>
            <div className="max-h-36 scrollbar-thin space-y-0.5 overflow-y-auto pr-0.5">
              {minutes.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleMinuteChange(m)}
                  className={cn(
                    "w-full cursor-pointer rounded-lg py-1 text-center font-mono text-xs transition-colors",
                    minute === m
                      ? "bg-emerald-600 font-bold text-white shadow-xs"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                  )}
                >
                  {m.toString().padStart(2, "0")}
                </button>
              ))}
            </div>
          </div>

          {/* AM / PM */}
          <div className="space-y-1">
            <span className="block text-center text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Period
            </span>
            <div className="flex flex-col gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => handlePeriodChange("AM")}
                className={cn(
                  "w-full cursor-pointer rounded-lg py-2 text-center text-xs font-bold transition-all",
                  period === "AM"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
                )}
              >
                AM
              </button>
              <button
                type="button"
                onClick={() => handlePeriodChange("PM")}
                className={cn(
                  "w-full cursor-pointer rounded-lg py-2 text-center text-xs font-bold transition-all",
                  period === "PM"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
                )}
              >
                PM
              </button>
            </div>
          </div>
        </div>

        {/* Presets footer */}
        <div className="pt-2">
          <span className="mb-1.5 block text-[10px] font-medium text-slate-400">Quick Presets</span>
          <div className="flex flex-wrap gap-1">
            {presets.map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => {
                  onChange?.(p.val);
                  setOpen(false);
                }}
                className={cn(
                  "cursor-pointer rounded-md border px-2 py-0.5 text-[10px] font-medium transition-colors",
                  value === p.val
                    ? "border-emerald-500 bg-emerald-50 font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800",
                )}
              >
                {p.label.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
