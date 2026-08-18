"use client";

import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DONATION_STATUS_OPTIONS } from "@/constants/donation-logs";
import { useMemo } from "react";

interface DonationFiltersProps {
  fromDate?: Date;
  toDate?: Date;
  country: string;
  city: string;
  statusFilter: string;
  hasFilters: boolean;
  onFromDateChange: (date?: Date) => void;
  onToDateChange: (date?: Date) => void;
  onCountryChange: (val: string) => void;
  onCityChange: (val: string) => void;
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
}

export function DonationFilters({
  fromDate,
  toDate,
  country,
  city,
  statusFilter,
  hasFilters,
  onFromDateChange,
  onToDateChange,
  onCountryChange,
  onCityChange,
  onStatusChange,
  onClearFilters,
}: DonationFiltersProps) {
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (fromDate || toDate) count++;
    if (country && country !== "all" && country !== "All") count++;
    if (city && city !== "all" && city !== "All") count++;
    if (statusFilter && statusFilter !== "All") count++;
    return count;
  }, [fromDate, toDate, country, city, statusFilter]);

  return (
    <ModuleFilters
      title="Filter Donation Logs"
      description="Refine donation transactions by date, country, city, and status"
      countryId={country}
      onCountryChange={onCountryChange}
      cityId={city}
      onCityChange={onCityChange}
      hasFilters={hasFilters}
      onClearFilters={onClearFilters}
      activeFilterCount={activeFilterCount}
    >
      <div className="min-w-[280px] flex-1 sm:min-w-[320px]">
        <DateRangeFilter
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={onFromDateChange}
          onToDateChange={onToDateChange}
          maxDate={new Date()}
        />
      </div>

      <div className="min-w-36 flex-1 space-y-1 sm:min-w-44">
        <Label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Donation Status
        </Label>
        <Select value={statusFilter} onValueChange={(v) => onStatusChange(v ?? "All")}>
          <SelectTrigger className="h-10 w-full rounded-xl border-slate-200/80 bg-white px-3 text-sm font-medium dark:border-slate-800 dark:bg-slate-900">
            <SelectValue>
              {DONATION_STATUS_OPTIONS.find((opt) => opt.value === statusFilter)?.label || "All"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {DONATION_STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </ModuleFilters>
  );
}
