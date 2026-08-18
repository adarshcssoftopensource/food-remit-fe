"use client";

import { useCallback, useMemo, useState } from "react";
import type { DashboardFiltersState } from "../types/dashboard.types";

export function useDashboardFilters() {
  const [filters, setFilters] = useState<DashboardFiltersState>({
    countryId: undefined,
    cityId: undefined,
  });

  const setCountryId = useCallback((countryId?: string) => {
    setFilters((prev) => ({
      ...prev,
      countryId: countryId && countryId !== "All" && countryId !== "all" ? countryId : undefined,
      cityId: undefined, // Always reset city when country changes
    }));
  }, []);

  const setCityId = useCallback((cityId?: string) => {
    setFilters((prev) => ({
      ...prev,
      cityId: cityId && cityId !== "All" && cityId !== "all" ? cityId : undefined,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      countryId: undefined,
      cityId: undefined,
    });
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.countryId) count += 1;
    if (filters.cityId) count += 1;
    return count;
  }, [filters]);

  const hasFilters = activeFilterCount > 0;

  return {
    filters,
    hasFilters,
    activeFilterCount,
    setCountryId,
    setCityId,
    resetFilters,
  };
}
