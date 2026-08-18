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
import { useMemo } from "react";

interface StoreFiltersProps {
  fromDate: Date | undefined;
  toDate: Date | undefined;
  country: string;
  city: string;
  statusFilter: string;
  hasFilters: boolean;
  onFromDateChange: (date: Date | undefined) => void;
  onToDateChange: (date: Date | undefined) => void;
  onCountryChange: (country: string) => void;
  onCityChange: (city: string) => void;
  onStatusFilterChange: (status: string) => void;
  onClearFilters: () => void;
}

const STORE_STATUS_OPTIONS = [
  { label: "All Status", value: "All" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

export function StoreFilters({
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
  onStatusFilterChange,
  onClearFilters,
}: StoreFiltersProps) {
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (fromDate || toDate) count++;
    if (country && country !== "All" && country !== "All Countries" && country !== "all") count++;
    if (city && city !== "All" && city !== "All Cities" && city !== "all") count++;
    if (statusFilter && statusFilter !== "All" && statusFilter !== "all") count++;
    return count;
  }, [fromDate, toDate, country, city, statusFilter]);

  return (
    <ModuleFilters
      title="Filter Stores"
      description="Refine stores by date, country, city, and status"
      countryId={country === "All Countries" ? "all" : country}
      onCountryChange={(val) => onCountryChange(val === "all" ? "All Countries" : val)}
      cityId={city === "All Cities" ? "all" : city}
      onCityChange={(val) => onCityChange(val === "all" ? "All Cities" : val)}
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
          Status
        </Label>
        <Select value={statusFilter} onValueChange={(v) => onStatusFilterChange(v ?? "All")}>
          <SelectTrigger className="h-10 w-full rounded-xl border-slate-200/80 bg-white px-3 text-sm font-medium dark:border-slate-800 dark:bg-slate-900">
            <SelectValue>
              {STORE_STATUS_OPTIONS.find((opt) => opt.value === statusFilter)?.label ||
                "All Status"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {STORE_STATUS_OPTIONS.map((opt) => (
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
