import * as React from "react";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface TimeRangeSelectProps {
  value: string; // e.g., "09:00 AM - 05:00 PM"
  onChange: (value: string) => void;
  invalid?: boolean;
}

function AnalogTimePicker({
  value,
  onChange,
  placeholder,
  invalid,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  invalid?: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [view, setView] = React.useState<"hours" | "minutes">("hours");

  const parsedHour = value ? parseInt(value.substring(0, 2), 10) : 12;
  const parsedMinute = value ? parseInt(value.substring(3, 5), 10) : 0;
  const parsedAmPm = value ? value.substring(6, 8) : "AM";

  const [selectedHour, setSelectedHour] = React.useState(parsedHour);
  const [selectedMinute, setSelectedMinute] = React.useState(parsedMinute);
  const [selectedAmPm, setSelectedAmPm] = React.useState(parsedAmPm);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setView("hours");
      setSelectedHour(value ? parseInt(value.substring(0, 2), 10) : 12);
      setSelectedMinute(value ? parseInt(value.substring(3, 5), 10) : 0);
      setSelectedAmPm(value ? value.substring(6, 8) : "AM");
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
      setIsOpen(false); // Automatically close after selecting minute
    }
  };

  const renderNumbers = () => {
    const radius = 105; // Slightly larger radius
    const items = [];
    if (view === "hours") {
      for (let i = 1; i <= 12; i++) {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        const isSelected = selectedHour === i || (selectedHour === 12 && i === 12);
        items.push(
          <div
            key={`h-${i}`}
            className={cn(
              "absolute -mt-4.5 -ml-4.5 flex h-9 w-9 items-center justify-center rounded-full text-sm transition-all",
              isSelected
                ? "z-10 scale-110 bg-emerald-500 font-bold text-white shadow-lg"
                : "z-0 text-slate-700 hover:bg-emerald-100/50",
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
        const isSelected = selectedMinute === i;
        items.push(
          <div
            key={`m-${i}`}
            className={cn(
              "absolute -mt-4.5 -ml-4.5 flex h-9 w-9 items-center justify-center rounded-full text-sm transition-all",
              isSelected
                ? "z-10 scale-110 bg-emerald-500 font-bold text-white shadow-lg"
                : "z-0 text-slate-700 hover:bg-emerald-100/50",
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
      <PopoverTrigger className={"w-full"}>
        <button
          type="button"
          className={cn(
            "flex h-11 w-full items-center rounded-xl border border-slate-200 bg-white px-3 transition-colors focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none",
            invalid && "border-red-400 bg-red-50/30",
            !value && "text-slate-400",
          )}
        >
          <Clock className="mr-2 h-4 w-4 shrink-0 text-slate-500" />
          <span
            className={cn(
              "flex-1 text-left text-sm",
              value ? "font-medium text-slate-900" : "text-slate-400",
            )}
          >
            {value || placeholder}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-85 rounded-3xl border-slate-200 bg-white p-6 shadow-2xl"
        align="center"
      >
        <div className="flex w-full flex-col items-center">
          <div className="mb-8 flex w-full flex-col items-center rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
            <div className="flex items-center justify-center gap-1 text-6xl font-black tracking-tighter text-slate-800">
              <button
                onClick={() => setView("hours")}
                className={cn(
                  "rounded-xl px-2 py-1 transition-colors hover:text-emerald-600",
                  view === "hours" && "bg-emerald-100/50 text-emerald-600",
                )}
              >
                {selectedHour.toString().padStart(2, "0")}
              </button>
              <span className="-mx-2 pb-2 text-slate-300">:</span>
              <button
                onClick={() => setView("minutes")}
                className={cn(
                  "rounded-xl px-2 py-1 transition-colors hover:text-emerald-600",
                  view === "minutes" && "bg-emerald-100/50 text-emerald-600",
                )}
              >
                {selectedMinute.toString().padStart(2, "0")}
              </button>
            </div>

            <div className="mt-5 flex w-full max-w-45 items-center rounded-xl bg-slate-200/50 p-1.5">
              <button
                onClick={() => updateTime(selectedHour, selectedMinute, "AM")}
                className={cn(
                  "flex-1 rounded-lg py-2 text-sm font-bold transition-all",
                  selectedAmPm === "AM"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800",
                )}
              >
                AM
              </button>
              <button
                onClick={() => updateTime(selectedHour, selectedMinute, "PM")}
                className={cn(
                  "flex-1 rounded-lg py-2 text-sm font-bold transition-all",
                  selectedAmPm === "PM"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800",
                )}
              >
                PM
              </button>
            </div>
          </div>

          <div className="flex w-full touch-none justify-center select-none">
            <div
              ref={clockRef}
              className="relative h-70 w-70 cursor-pointer rounded-full border border-slate-100 bg-slate-50 shadow-inner"
              onMouseDown={(e) => {
                handleClockInteract(e);
              }}
              onMouseMove={handleDrag}
              onMouseUp={handleMouseUp}
              onTouchStart={(e) => {
                handleClockInteract(e);
              }}
              onTouchMove={handleDrag}
              onTouchEnd={handleMouseUp}
            >
              <div className="absolute top-1/2 left-1/2 z-20 -mt-[5px] -ml-[5px] h-2.5 w-2.5 rounded-full bg-emerald-600"></div>

              <div
                className="absolute bottom-1/2 left-1/2 z-10 w-[2px] origin-bottom rounded-t-full bg-emerald-500 transition-transform duration-300 ease-out"
                style={{
                  height: "105px",
                  transform: `translateX(-50%) rotate(${getHandRotation()}deg)`,
                }}
              >
                <div className="absolute -top-4 -left-4.25 h-9 w-9 rounded-full border-[3px] border-emerald-500 bg-emerald-400/20"></div>
              </div>

              {renderNumbers()}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function TimeRangeSelect({ value, onChange, invalid }: TimeRangeSelectProps) {
  const [openTime, closeTime] = value ? value.split(" - ") : ["", ""];

  const handleOpenChange = (newOpen: string) => {
    if (closeTime) {
      onChange(`${newOpen} - ${closeTime}`);
    } else {
      onChange(`${newOpen} - `);
    }
  };

  const handleCloseChange = (newClose: string) => {
    if (openTime) {
      onChange(`${openTime} - ${newClose}`);
    } else {
      onChange(` - ${newClose}`);
    }
  };

  return (
    <div className={cn("flex w-full items-center gap-2", invalid && "text-red-500")}>
      <AnalogTimePicker
        value={openTime}
        onChange={handleOpenChange}
        placeholder="Open time"
        invalid={invalid}
      />
      <span className="font-medium text-slate-400">to</span>
      <AnalogTimePicker
        value={closeTime}
        onChange={handleCloseChange}
        placeholder="Close time"
        invalid={invalid}
      />
    </div>
  );
}
