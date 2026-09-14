import * as React from "react";
import { cn } from "@/lib/utils";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface DaysOpenSelectProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  invalid?: boolean;
}

export function DaysOpenSelect({ selected = [], onChange, invalid }: DaysOpenSelectProps) {
  const toggleDay = (day: string) => {
    if (selected.includes(day)) {
      onChange(selected.filter((d) => d !== day));
    } else {
      onChange([...selected, day]);
    }
  };

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-2 rounded-xl border p-2 sm:grid-cols-4 lg:grid-cols-7",
        invalid ? "border-red-400 bg-red-50/30" : "border-slate-200 bg-white",
      )}
    >
      {DAYS.map((day) => {
        const isSelected = selected.includes(day);
        return (
          <button
            key={day}
            type="button"
            onClick={() => toggleDay(day)}
            className={cn(
              "flex h-11 items-center justify-center rounded-lg text-sm font-semibold transition-colors",
              isSelected
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            )}
          >
            {day.substring(0, 3)}
          </button>
        );
      })}
    </div>
  );
}
