"use client";

import { Filter, RotateCcw } from "lucide-react";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRY_OPTIONS, CITY_OPTIONS } from "@/constants/foundation-management";

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
}: FoundationFiltersProps) {
  return (
    <div className="border-t bg-linear-to-br from-blue-50/50 to-transparent p-4">
      <div className="mb-5 flex items-center gap-3">
        <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
          <Filter className="text-primary h-4 w-4" />
        </div>
        <CardTitle className="text-base font-semibold text-gray-900">Filter Foundations</CardTitle>
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
            options={COUNTRY_OPTIONS}
          />

          <FilterSelect label="City" value={city} onChange={onCityChange} options={CITY_OPTIONS} />
        </div>

        <div className="flex justify-end">
          <Button
            variant="destructive"
            onClick={onClearFilters}
            disabled={!hasFilters}
            className="h-10 rounded-lg"
          >
            <RotateCcw size={22} />
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}

function FilterSelect({ label, value, onChange, options }: FilterSelectProps) {
  return (
    <div className="space-y-2">
      <Label className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
        {label}
      </Label>
      <Select value={value} onValueChange={(v) => onChange(v ?? label)}>
        <SelectTrigger className="h-10! w-full rounded-lg border-gray-200">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
