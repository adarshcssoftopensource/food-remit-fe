"use client";

import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { useMemo } from "react";

type ReportDateFiltersProps = {
  fromDate?: Date;
  toDate?: Date;
  countryId?: string;
  cityId?: string;
  hasFilters: boolean;
  onFromDateChange: (date?: Date) => void;
  onToDateChange: (date?: Date) => void;
  onCountryChange?: (country: string) => void;
  onCityChange?: (city: string) => void;
  onApply?: () => void;
  onCancel?: () => void;
  onClear: () => void;
  children?: React.ReactNode;
};

export function ReportDateFilters({
  fromDate,
  toDate,
  countryId = "all",
  cityId = "all",
  hasFilters,
  onFromDateChange,
  onToDateChange,
  onCountryChange,
  onCityChange,
  onApply,
  onCancel,
  onClear,
  children,
}: ReportDateFiltersProps) {
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (fromDate || toDate) count++;
    if (countryId && countryId !== "all" && countryId !== "All") count++;
    if (cityId && cityId !== "all" && cityId !== "All") count++;
    return count;
  }, [fromDate, toDate, countryId, cityId]);

  return (
    <ModuleFilters
      title="Filter Reports"
      description="Refine report generation by date range, country, and city"
      countryId={countryId}
      onCountryChange={onCountryChange}
      cityId={cityId}
      onCityChange={onCityChange}
      hasFilters={hasFilters}
      onApplyFilters={onApply}
      onCancelFilters={onCancel}
      onClearFilters={onClear}
      activeFilterCount={activeFilterCount}
    >
      <div className="min-w-[280px] flex-1 sm:min-w-[320px]">
        <DateRangeFilter
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={onFromDateChange}
          onToDateChange={onToDateChange}
        />
      </div>
      {children}
    </ModuleFilters>
  );
}
