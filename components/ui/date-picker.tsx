"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  date?: Date;
  setDate?: (date?: Date) => void;
  placeholder?: string;
  className?: string;
  maxDate?: Date;
}

export function DatePicker({
  date,
  setDate,
  placeholder = "YYYY-MM-DD",
  className,
  maxDate,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant={"outline"}
            className={cn(
              "flex h-10 w-full min-w-0 items-center justify-start rounded-xl border border-slate-200/80 bg-white/70 px-2.5 py-2 text-xs font-normal text-slate-800 shadow-xs backdrop-blur-md transition-all sm:px-3 sm:text-sm dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200",
              !date && "text-slate-400 dark:text-slate-500",
              className,
            )}
          >
            <CalendarIcon className="mr-1.5 h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
            <span className="min-w-0 flex-1 truncate text-left">
              {date ? format(date, "yyyy-MM-dd") : placeholder}
            </span>
            {date && (
              <span
                role="button"
                tabIndex={0}
                className="ring-offset-background ml-1.5 shrink-0 rounded-sm opacity-70 transition-opacity hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setDate?.(undefined);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    setDate?.(undefined);
                  }
                }}
              >
                <X className="h-3.5 w-3.5" />
                <span className="sr-only">Clear date</span>
              </span>
            )}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          captionLayout="dropdown"
          className="p-3 [--cell-size:--spacing(9)]"
          disabled={maxDate ? { after: maxDate } : undefined}
        />
      </PopoverContent>
    </Popover>
  );
}
