"use client";

import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { useMemo } from "react";

interface StoreFiltersProps {
  fromDate: Date | undefined;
  toDate: Date | undefined;
  country: string;
  city: string;
  hasFilters: boolean;
  onFromDateChange: (date: Date | undefined) => void;
  onToDateChange: (date: Date | undefined) => void;
  onCountryChange: (country: string) => void;
  onCityChange: (city: string) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
  onCancelFilters: () => void;
}

export function StoreFilters({
  fromDate,
  toDate,
  country,
  city,
  hasFilters,
  onFromDateChange,
  onToDateChange,
  onCountryChange,
  onCityChange,
  onClearFilters,
  onApplyFilters,
  onCancelFilters,
}: StoreFiltersProps) {
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (fromDate || toDate) count++;
    if (country && country !== "All" && country !== "All Countries" && country !== "all") count++;
    if (city && city !== "All" && city !== "All Cities" && city !== "all") count++;
    return count;
  }, [fromDate, toDate, country, city]);

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
      onApplyFilters={onApplyFilters}
      onCancelFilters={onCancelFilters}
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
    </ModuleFilters>
  );
}
