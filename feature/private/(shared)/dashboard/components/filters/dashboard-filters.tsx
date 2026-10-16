"use client";

import { CitySelect } from "@/components/common/city-select";
import { CountrySelect } from "@/components/common/country-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, RotateCcw, SlidersHorizontal } from "lucide-react";
import type { DashboardFiltersState } from "../../types/dashboard.types";

interface DashboardFiltersProps {
  filters: DashboardFiltersState;
  hasFilters: boolean;
  activeFilterCount?: number;
  onCountryChange: (countryId?: string) => void;
  onCityChange: (cityId?: string) => void;
  onReset: () => void;
  onRefresh?: () => void;
  isFetching?: boolean;
}

export function DashboardFilters({
  filters,
  hasFilters,
  activeFilterCount = 0,
  onCountryChange,
  onCityChange,
  onReset,
  onRefresh,
  isFetching = false,
}: DashboardFiltersProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-linear-to-b from-white via-white to-slate-50/50 p-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.04)] backdrop-blur-xl sm:p-3.5 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900/70">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="flex shrink-0 items-center gap-2">
            <div className="bg-primary flex size-8 items-center justify-center rounded-xl text-white shadow-xs dark:bg-white dark:text-slate-900">
              <SlidersHorizontal className="size-3.5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold tracking-wider text-slate-700 uppercase dark:text-slate-200">
                Filters
              </span>
              {hasFilters && (
                <Badge
                  variant="secondary"
                  className="h-5 gap-1 border-slate-200 bg-slate-100 px-1.5 text-[10px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                  {activeFilterCount}
                </Badge>
              )}
            </div>
          </div>

          <div className="hidden h-4 w-px bg-slate-200 sm:block dark:bg-slate-800" />

          {/* Country Dropdown */}
          <div className="w-full sm:w-56">
            <CountrySelect
              value={filters.countryId || "All"}
              onValueChange={(val) => {
                onCountryChange(val === "All" || !val ? undefined : val);
              }}
              includeAll={true}
              allLabel="All Countries"
              placeholder="Filter by country..."
              className="h-9! rounded-xl border-slate-200/80 bg-slate-50/70 text-xs font-medium hover:border-slate-300 hover:bg-slate-100/70 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-slate-800"
            />
          </div>

          {/* City Dropdown */}
          <div className="w-full sm:w-56">
            <CitySelect
              countryId={filters.countryId}
              value={filters.cityId || "All"}
              onValueChange={(val) => {
                onCityChange(val === "All" || !val ? undefined : val);
              }}
              includeAll={true}
              allLabel="All Cities"
              placeholder={filters.countryId ? "Filter by city..." : "Select country first"}
              disabled={!filters.countryId}
              className="h-9! rounded-xl border-slate-200/80 bg-slate-50/70 text-xs font-medium hover:border-slate-300 hover:bg-slate-100/70 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-slate-800"
            />
          </div>

          {/* Reset Filters Button */}
          {hasFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="h-9 gap-1 rounded-xl border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
            >
              <RotateCcw className="size-3" />
              <span>Reset</span>
            </Button>
          )}
        </div>

        {/* Refresh Data Action */}
        {onRefresh && (
          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-2.5 sm:border-0 sm:pt-0 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isFetching}
              className="h-9 gap-1.5 rounded-xl border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <RefreshCw
                className={`size-3 transition-transform duration-500 ${
                  isFetching
                    ? "animate-spin text-slate-900 dark:text-white"
                    : "text-slate-400 group-hover:text-slate-700"
                }`}
              />
              <span>{isFetching ? "Refreshing..." : "Refresh Data"}</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
