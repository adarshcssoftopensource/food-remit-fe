"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

type ClockView = "hours" | "minutes";
type UpdateTime = (h: number, m: number, a: string) => void;

function parseTimeValue(value: string, placeholder?: string) {
  const isSelected = Boolean(
    value && value !== "00:00" && value.includes(" ") && value.includes(":"),
  );

  const defaultHour = placeholder?.toLowerCase().includes("close") ? 10 : 9;
  const defaultAmPm = placeholder?.toLowerCase().includes("close") ? "PM" : "AM";

  return {
    isSelected,
    hour: isSelected ? parseInt(value.substring(0, 2), 10) : defaultHour,
    minute: isSelected ? parseInt(value.substring(3, 5), 10) : 0,
    amPm: isSelected ? value.substring(6, 8) : defaultAmPm,
  };
}

function getClockIconClass(invalid: boolean | undefined, isSelected: boolean) {
  return invalid
    ? "text-red-500"
    : isSelected
      ? "text-emerald-600"
      : "text-slate-400 group-hover:text-emerald-600";
}

function DigitalTimeHeader({
  view,
  onViewChange,
  selectedHour,
  selectedMinute,
  selectedAmPm,
  onTimeChange,
}: {
  view: ClockView;
  onViewChange: (view: ClockView) => void;
  selectedHour: number;
  selectedMinute: number;
  selectedAmPm: string;
  onTimeChange: UpdateTime;
}) {
  return (
    <div className="mb-4 flex w-full flex-col items-center rounded-xl border border-slate-100 bg-slate-50/80 p-3">
      <div className="flex items-center justify-center gap-1 text-4xl font-extrabold tracking-tight text-slate-800">
        <button
          type="button"
          onClick={() => onViewChange("hours")}
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
          onClick={() => onViewChange("minutes")}
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
          onClick={() => onTimeChange(selectedHour, selectedMinute, "AM")}
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
          onClick={() => onTimeChange(selectedHour, selectedMinute, "PM")}
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
  );
}

function ClockDial({
  view,
  selectedHour,
  selectedMinute,
  selectedAmPm,
  onTimeChange,
  onRelease,
}: {
  view: ClockView;
  selectedHour: number;
  selectedMinute: number;
  selectedAmPm: string;
  onTimeChange: UpdateTime;
  onRelease: () => void;
}) {
  const clockRef = React.useRef<HTMLDivElement>(null);

  const handleClockInteract = (e: React.MouseEvent | React.TouchEvent) => {
    if (!clockRef.current) return;
    const rect = clockRef.current.getBoundingClientRect();
    const touch = "touches" in e ? e.touches[0] : null;
    const clientX = touch ? touch.clientX : (e as React.MouseEvent).clientX;
    const clientY = touch ? touch.clientY : (e as React.MouseEvent).clientY;

    const x = clientX - rect.left - rect.width / 2;
    const y = clientY - rect.top - rect.height / 2;

    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    if (view === "hours") {
      let h = Math.round(angle / 30);
      if (h === 0) h = 12;
      onTimeChange(h, selectedMinute, selectedAmPm);
    } else {
      let m = Math.round(angle / 6);
      if (m === 60) m = 0;
      onTimeChange(selectedHour, m, selectedAmPm);
    }
  };

  const handleDrag = (e: any) => {
    if (e.buttons !== 1 && e.type !== "touchmove") return;
    handleClockInteract(e);
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
    <div className="flex w-full touch-none justify-center select-none">
      <div
        ref={clockRef}
        aria-hidden="true"
        className="relative h-60 w-60 cursor-pointer rounded-full border border-slate-100 bg-slate-50 shadow-inner"
        onMouseDown={handleClockInteract}
        onMouseMove={handleDrag}
        onMouseUp={onRelease}
        onTouchStart={handleClockInteract}
        onTouchMove={handleDrag}
        onTouchEnd={onRelease}
      >
        <div className="absolute top-1/2 left-1/2 z-20 -mt-1 -ml-1 h-2 w-2 rounded-full bg-emerald-600"></div>

        <div
          className="absolute bottom-1/2 left-1/2 z-10 w-0.5 origin-bottom rounded-t-full bg-emerald-500 transition-transform duration-300 ease-out"
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
  );
}

function TimePresetList({
  value,
  onTimeChange,
  onClose,
}: {
  value: string;
  onTimeChange: UpdateTime;
  onClose: () => void;
}) {
  return (
    <div className="mt-3 flex w-full flex-wrap justify-center gap-1 border-t border-slate-100 pt-2.5">
      {COMMON_TIME_PRESETS.slice(0, 6).map((preset) => (
        <button
          key={preset}
          type="button"
          onClick={() => {
            const [time, ap] = preset.split(" ");
            if (time && ap) {
              const [h, m] = time.split(":").map(Number);
              if (h !== undefined && m !== undefined) {
                onTimeChange(h, m, ap);
              }
            }
            onClose();
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
  );
}

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
  const [view, setView] = React.useState<ClockView>("hours");

  const parsed = parseTimeValue(value, placeholder);
  const isSelected = parsed.isSelected;

  const [selectedHour, setSelectedHour] = React.useState(parsed.hour);
  const [selectedMinute, setSelectedMinute] = React.useState(parsed.minute);
  const [selectedAmPm, setSelectedAmPm] = React.useState(parsed.amPm);

  const handleOpenChange = (open: boolean) => {
    if (disabled) return;
    setIsOpen(open);
    if (open) {
      setView("hours");
      setSelectedHour(parsed.hour);
      setSelectedMinute(parsed.minute);
      setSelectedAmPm(parsed.amPm);
    }
  };

  const updateTime = (h: number, m: number, a: string) => {
    setSelectedHour(h);
    setSelectedMinute(m);
    setSelectedAmPm(a);
    const hh = h.toString().padStart(2, "0");
    const mm = m.toString().padStart(2, "0");
    onChange(`${hh}:${mm} ${a}`);
  };

  const handleMouseUp = () => {
    if (view === "hours") {
      setView("minutes");
    } else {
      setIsOpen(false);
    }
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
          isSelected && !invalid && "font-medium text-slate-800",
        )}
      >
        <span className="flex items-center gap-1.5 truncate">
          <Clock
            className={cn(
              "h-3.5 w-3.5 shrink-0 transition-colors",
              getClockIconClass(invalid, isSelected),
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
          <DigitalTimeHeader
            view={view}
            onViewChange={setView}
            selectedHour={selectedHour}
            selectedMinute={selectedMinute}
            selectedAmPm={selectedAmPm}
            onTimeChange={updateTime}
          />

          {/* Analog Clock Dial */}
          <ClockDial
            view={view}
            selectedHour={selectedHour}
            selectedMinute={selectedMinute}
            selectedAmPm={selectedAmPm}
            onTimeChange={updateTime}
            onRelease={handleMouseUp}
          />

          {/* Quick Presets */}
          <TimePresetList
            value={value}
            onTimeChange={updateTime}
            onClose={() => setIsOpen(false)}
          />

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
