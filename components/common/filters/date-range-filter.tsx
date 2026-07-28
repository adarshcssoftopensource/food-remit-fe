"use client";

import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";

interface DateRangeFilterProps {
  fromDate?: Date;
  toDate?: Date;
  onFromDateChange: (date?: Date) => void;
  onToDateChange: (date?: Date) => void;
  fromLabel?: string;
  toLabel?: string;
  placeholder?: string;
  wrapperClassName?: string;
  itemClassName?: string;
  pickerClassName?: string;
  labelClassName?: string;
}

export function DateRangeFilter({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  fromLabel = "From Date",
  toLabel = "To Date",
  placeholder = "dd/mm/yyyy",
  wrapperClassName = "grid grid-cols-1 gap-3 md:grid-cols-2",
  itemClassName = "space-y-2",
  pickerClassName = "h-10 w-full rounded-lg border-gray-200",
  labelClassName = "text-muted-foreground text-xs font-semibold tracking-wide uppercase",
}: DateRangeFilterProps) {
  return (
    <div className={wrapperClassName}>
      <div className={itemClassName}>
        <Label className={labelClassName}>{fromLabel}</Label>
        <DatePicker
          date={fromDate}
          setDate={onFromDateChange}
          placeholder={placeholder}
          className={pickerClassName}
        />
      </div>

      <div className={itemClassName}>
        <Label className={labelClassName}>{toLabel}</Label>
        <DatePicker
          date={toDate}
          setDate={onToDateChange}
          placeholder={placeholder}
          className={pickerClassName}
        />
      </div>
    </div>
  );
}
