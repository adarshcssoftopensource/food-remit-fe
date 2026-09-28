"use client";

import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { useMemo } from "react";

interface FoundationFiltersProps {
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
  onApplyFilters?: () => void;
  onCancelFilters?: () => void;
}

export function FoundationFilters({
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
}: FoundationFiltersProps) {
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (fromDate || toDate) count++;
    if (country && country !== "All" && country !== "all" && country !== "All Countries") count++;
    if (city && city !== "All" && city !== "all" && city !== "All Cities") count++;
    return count;
  }, [fromDate, toDate, country, city]);

  return (
    <ModuleFilters
      title="Filter Foundations"
      description="Refine foundations by date, country, and city"
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
