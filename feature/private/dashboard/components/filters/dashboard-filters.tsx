"use client";

import { CitySelect } from "@/components/common/city-select";
import { CountrySelect } from "@/components/common/country-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, RefreshCw, RotateCcw, SlidersHorizontal, Sparkles } from "lucide-react";
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
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-4.5 shadow-xs backdrop-blur-md transition-all sm:p-5 dark:border-slate-800/80 dark:bg-slate-900/90">
      {/* Subtle background glow effect */}
      <div className="bg-primary/5 pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full blur-2xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-indigo-500/5 blur-2xl" />

      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Filter Controls */}
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/10 text-primary dark:bg-primary/20 flex h-9 w-9 items-center justify-center rounded-xl shadow-xs">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider text-slate-800 uppercase dark:text-slate-200">
                Filters
              </span>
              {hasFilters && (
                <Badge
                  variant="secondary"
                  className="text-primary bg-primary/10 border-primary/20 h-5 px-1.5 text-[10px] font-bold"
                >
                  {activeFilterCount} active
                </Badge>
              )}
            </div>
          </div>

          <div className="hidden h-5 w-px bg-slate-200 sm:block dark:bg-slate-800" />

          {/* Country Select */}
          <div className="w-full sm:w-60">
            <CountrySelect
              value={filters.countryId || "All"}
              onValueChange={(val) => {
                onCountryChange(val === "All" || !val ? undefined : val);
              }}
              includeAll={true}
              allLabel="All Countries"
              placeholder="Filter by country..."
              className="h-10! rounded-xl border-slate-200 bg-slate-50/50 text-xs font-medium hover:bg-slate-100/70 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-slate-800"
            />
          </div>

          {/* City Select */}
          <div className="w-full sm:w-60">
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
              className="h-10! rounded-xl border-slate-200 bg-slate-50/50 text-xs font-medium hover:bg-slate-100/70 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-slate-800"
            />
          </div>

          {/* Clear / Reset Filters */}
          {hasFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="h-10 gap-1.5 rounded-xl border-rose-200 bg-rose-50/50 px-3.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100/80 hover:text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-900/50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Filters</span>
            </Button>
          )}
        </div>

        {/* Right: Actions (Refresh) */}
        {onRefresh && (
          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-2 sm:border-0 sm:pt-0 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isFetching}
              className="group h-10 gap-2 rounded-xl border-slate-200/90 bg-white px-4 text-xs font-semibold text-slate-700 shadow-xs transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 transition-transform duration-500 ${
                  isFetching
                    ? "text-primary animate-spin"
                    : "text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200"
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
