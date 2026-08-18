"use client";

import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";

interface DateRangeFilterProps {
  fromDate?: Date;
  toDate?: Date;
  onFromDateChange?: (date?: Date) => void;
  onToDateChange?: (date?: Date) => void;
  fromLabel?: string;
  toLabel?: string;
  placeholder?: string;
  maxDate?: Date;
  wrapperClassName?: string;
  itemClassName?: string;
  pickerClassName?: string;
  labelClassName?: string;
  loading?: boolean;
}

export function DateRangeFilter({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  fromLabel = "From Date",
  toLabel = "To Date",
  placeholder = "YYYY-MM-DD",
  maxDate = new Date(),
  wrapperClassName = "flex flex-col sm:flex-row gap-3 w-full",
  itemClassName = "flex-1 min-w-0 space-y-1",
  pickerClassName = "h-10 w-full rounded-xl border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900",
  labelClassName = "text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate",
  loading = false,
}: DateRangeFilterProps) {
  return (
    <div className={wrapperClassName}>
      <div className={itemClassName}>
        <Label className={labelClassName}>{fromLabel}</Label>
        {loading ? (
          <div className={`h-10 w-full animate-pulse rounded-xl bg-slate-200 ${pickerClassName}`} />
        ) : (
          <DatePicker
            date={fromDate}
            setDate={onFromDateChange}
            placeholder={placeholder}
            className={pickerClassName}
            maxDate={maxDate}
          />
        )}
      </div>

      <div className={itemClassName}>
        <Label className={labelClassName}>{toLabel}</Label>
        {loading ? (
          <div className={`h-10 w-full animate-pulse rounded-xl bg-slate-200 ${pickerClassName}`} />
        ) : (
          <DatePicker
            date={toDate}
            setDate={onToDateChange}
            placeholder={placeholder}
            className={pickerClassName}
            maxDate={maxDate}
          />
        )}
      </div>
    </div>
  );
}
