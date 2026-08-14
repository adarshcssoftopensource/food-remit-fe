"use client";

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

import { Filter, RotateCcw } from "lucide-react";
import { useGetCountriesDropdown } from "@/feature/private/settings/hooks/use-get-countries-dropdown";
import { useGetCities } from "@/feature/private/settings/hooks/use-get-cities";
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

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  disabled?: boolean;
}

function FilterSelect({ label, value, onChange, options, disabled }: FilterSelectProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
        {label}
      </Label>
      <Select
        value={value}
        onValueChange={(v) => onChange(v ?? options[0].value)}
        disabled={disabled}
      >
        <SelectTrigger className="h-10! w-full rounded-lg border-gray-200">
          <SelectValue>
            {options.find((opt) => opt.value === value)?.label || options[0]?.label}
          </SelectValue>
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
  const STORE_STATUS_OPTIONS = [
    { label: "All Status", value: "All" },
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];
  const { countries: countriesData } = useGetCountriesDropdown();
  const selectedCountryObj = useMemo(
    () => countriesData?.find((c) => c.name === country),
    [countriesData, country],
  );

  const { data: citiesDataResponse } = useGetCities({
    countryId: selectedCountryObj?.id ?? "All",
    limit: 1000,
  });

  const countryOptions = useMemo(() => {
    const list = countriesData ?? [];
    return [
      { label: "All Countries", value: "All Countries" },
      ...list.map((c) => ({ label: c.name, value: c.name })),
    ];
  }, [countriesData]);

  const cityOptions = useMemo(() => {
    const list = citiesDataResponse?.data ?? [];
    const uniqueCityNames = Array.from(new Set(list.map((c) => c.name))).sort();
    return [
      { label: "All Cities", value: "All Cities" },
      ...uniqueCityNames.map((name) => ({ label: name, value: name })),
    ];
  }, [citiesDataResponse]);

  return (
    <div className="from-primary/5/50 border-t bg-linear-to-br to-transparent p-4">
      <div className="mb-4 flex items-center gap-3">
        <div className="bg-primary/10 flex size-8 items-center justify-center rounded-lg">
          <Filter className="text-primary size-4" />
        </div>
        <CardTitle className="text-base font-semibold text-gray-900">Filter Stores</CardTitle>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
            options={countryOptions}
          />

          <FilterSelect
            label="City"
            value={city}
            onChange={onCityChange}
            options={cityOptions}
            disabled={country === "All Countries"}
          />

          <FilterSelect
            label="Status"
            value={statusFilter}
            onChange={onStatusFilterChange}
            options={STORE_STATUS_OPTIONS}
          />
        </div>

        <div className="flex justify-end">
          <Button
            variant="destructive"
            onClick={onClearFilters}
            disabled={!hasFilters}
            className="h-10 w-full rounded-lg sm:w-auto"
          >
            <RotateCcw size={16} />
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
