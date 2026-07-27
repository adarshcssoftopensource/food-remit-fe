"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  setDate?: (date?: Date) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  date,
  setDate,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              className,
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            {date ? format(date, "dd/MM/yyyy") : <span>{placeholder}</span>}
            {date && (
              <button
                type="button"
                className="ring-offset-background ml-auto rounded-sm opacity-70 transition-opacity hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setDate?.(undefined);
                }}
              >
                <X className="h-3.5 w-3.5" />
                <span className="sr-only">Clear date</span>
              </button>
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
        />
      </PopoverContent>
    </Popover>
  );
}
