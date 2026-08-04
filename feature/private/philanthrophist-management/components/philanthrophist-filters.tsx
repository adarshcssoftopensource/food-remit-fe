"use client";

import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Filter, RotateCcw } from "lucide-react";

import {
  PHILANTHROPIST_CITIES,
  PHILANTHROPIST_COUNTRIES,
} from "@/constants/philanthrophist-management";
import { FilterSelect } from "./filter-select";

interface PhilanthrophistFiltersProps {
  fromDate?: Date;
  toDate?: Date;
  country: string;
  city: string;
  hasFilters: boolean;
  onFromDateChange: (date?: Date) => void;
  onToDateChange: (date?: Date) => void;
  onCountryChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onClearFilters: () => void;
}

export function PhilanthrophistFilters({
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
}: PhilanthrophistFiltersProps) {
  return (
    <div className="p-4">
      <div className="mb-5 flex items-center gap-3">
        <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
          <Filter className="text-primary h-4 w-4" />
        </div>
        <CardTitle className="text-foreground text-base font-semibold">
          Filter Philanthrophists
        </CardTitle>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          <DateRangeFilter
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={onFromDateChange}
            onToDateChange={onToDateChange}
            wrapperClassName="contents"
          />
          <FilterSelect
            label="Country"
            value={country}
            onChange={onCountryChange}
            options={PHILANTHROPIST_COUNTRIES}
          />
          <FilterSelect
            label="City"
            value={city}
            onChange={onCityChange}
            options={PHILANTHROPIST_CITIES}
          />
        </div>
        <div className="flex justify-end">
          <Button
            variant="destructive"
            onClick={onClearFilters}
            disabled={!hasFilters}
            className="h-10 w-full rounded-lg sm:w-auto"
          >
            <RotateCcw size={18} /> Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
