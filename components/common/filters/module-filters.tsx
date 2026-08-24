"use client";

import { CitySelect } from "@/components/common/city-select";
import { CountrySelect } from "@/components/common/country-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Filter, RotateCcw } from "lucide-react";
import React from "react";

export interface ModuleFiltersProps {
  title?: string;
  description?: string;
  countryId?: string;
  onCountryChange?: (countryId: string) => void;
  cityId?: string;
  onCityChange?: (cityId: string) => void;
  hideCountryFilter?: boolean;
  hideCityFilter?: boolean;
  countryPlaceholder?: string;
  cityPlaceholder?: string;
  hasFilters?: boolean;
  onClearFilters?: () => void;
  children?: React.ReactNode;
  activeFilterCount?: number;
  className?: string;
}

export function ModuleFilters({
  title = "Filter Records",
  description,
  countryId,
  onCountryChange,
  cityId,
  onCityChange,
  hideCountryFilter = false,
  hideCityFilter = false,
  countryPlaceholder = "All Countries",
  cityPlaceholder = "All Cities",
  hasFilters = false,
  onClearFilters,
  children,
  activeFilterCount,
  className,
}: ModuleFiltersProps) {
  const showCountry = !hideCountryFilter && onCountryChange;
  const showCity = !hideCityFilter && onCityChange;

  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/70 bg-white/85 p-4 shadow-xs backdrop-blur-xl transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900/85",
        className,
      )}
    >
      {/* Decorative subtle header line */}
      <div className="from-primary/20 via-primary/60 to-primary/20 absolute inset-x-0 top-0 h-0.5 bg-linear-to-r" />

      <CardContent className="space-y-3.5 p-0">
        {/* Header row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/10 text-primary ring-primary/20 flex h-8 w-8 items-center justify-center rounded-xl ring-1">
              <Filter className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                  {title}
                </h3>
                {activeFilterCount !== undefined && activeFilterCount > 0 && (
                  <span className="bg-primary/10 text-primary ring-primary/20 rounded-full px-2 py-0.5 text-[10px] font-extrabold ring-1">
                    {activeFilterCount} active
                  </span>
                )}
              </div>
              {description && (
                <p className="text-[11px] text-slate-400 dark:text-slate-500">{description}</p>
              )}
            </div>
          </div>

          {onClearFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              disabled={!hasFilters}
              className={cn(
                "h-8 rounded-xl border-slate-200/80 px-3 text-xs font-semibold shadow-2xs transition-all dark:border-slate-700/80",
                hasFilters
                  ? "border-rose-200 bg-rose-50/80 text-rose-700 hover:bg-rose-100 hover:text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300"
                  : "text-slate-400 opacity-50 dark:text-slate-500",
              )}
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Reset Filters
            </Button>
          )}
        </div>

        {/* Filter controls grid */}
        <div className="flex flex-wrap items-end gap-3.5">
          {/* Country selector */}
          {showCountry && (
            <div className="min-w-36 flex-1 space-y-1 sm:min-w-44">
              <Label className="block truncate text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Country
              </Label>
              <CountrySelect
                value={countryId === "all" ? "" : countryId}
                onValueChange={(val) => {
                  onCountryChange(val || "all");
                  if (onCityChange) onCityChange("all");
                }}
                valueKey="id"
                includeAll
                allLabel={countryPlaceholder}
                placeholder={countryPlaceholder}
                className="h-10 rounded-xl"
              />
            </div>
          )}

          {/* City selector */}
          {showCity && (
            <div className="min-w-36 flex-1 space-y-1 sm:min-w-44">
              <Label className="block truncate text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                City
              </Label>
              <CitySelect
                countryId={countryId !== "all" && countryId ? countryId : undefined}
                value={cityId === "all" ? "" : cityId}
                onValueChange={(val) => onCityChange(val || "all")}
                includeAll
                allLabel={cityPlaceholder}
                placeholder={
                  countryId && countryId !== "all" ? cityPlaceholder : "Select country first"
                }
                disabled={!countryId || countryId === "all" || countryId === "All"}
                className="h-10 rounded-xl"
              />
            </div>
          )}

          {/* Custom module specific filters passed as children */}
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
