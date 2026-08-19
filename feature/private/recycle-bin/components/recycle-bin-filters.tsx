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
import { USER_STATUS_OPTIONS } from "@/constants/users-management";
import { useMemo } from "react";
import { RecycleBinFiltersProps } from "../types/recycle-bin.types";

interface ExtendedRecycleBinFiltersProps extends RecycleBinFiltersProps {
  country?: string;
  city?: string;
  onCountryChange?: (country: string) => void;
  onCityChange?: (city: string) => void;
}

export function RecycleBinFilters({
  fromDate,
  toDate,
  status,
  isLoading,
  hasFilters,
  country = "all",
  city = "all",
  onFromDateChange,
  onToDateChange,
  onStatusChange,
  onCountryChange,
  onCityChange,
  onClearFilters,
}: ExtendedRecycleBinFiltersProps) {
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (fromDate || toDate) count++;
    if (country && country !== "all" && country !== "All") count++;
    if (city && city !== "all" && city !== "All") count++;
    if (status) count++;
    return count;
  }, [fromDate, toDate, country, city, status]);

  return (
    <ModuleFilters
      title="Filter Recycled Users"
      description="Refine recycled users by date, country, city, and status"
      countryId={country}
      onCountryChange={onCountryChange}
      cityId={city}
      onCityChange={onCityChange}
      hasFilters={hasFilters}
      onClearFilters={onClearFilters}
      activeFilterCount={activeFilterCount}
    >
      <div className="min-w-70 flex-1 sm:min-w-[320px]">
        <DateRangeFilter
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={onFromDateChange}
          onToDateChange={onToDateChange}
          maxDate={new Date()}
          loading={isLoading}
        />
      </div>

      <div className="min-w-36 flex-1 space-y-1 sm:min-w-44">
        <Label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          User Status
        </Label>
        <Select value={status ?? ""} onValueChange={(v) => onStatusChange(v || null)}>
          <SelectTrigger className="h-10 w-full rounded-xl border-slate-200/80 bg-white px-3 text-sm font-medium dark:border-slate-800 dark:bg-slate-900">
            <SelectValue placeholder="All Users">
              {USER_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? "All Users"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {USER_STATUS_OPTIONS.map((opt) => (
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
