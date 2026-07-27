"use client";

import { Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PHILANTHROPIST_CITIES,
  PHILANTHROPIST_COUNTRIES,
} from "@/constants/philanthrophist-management";

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
          <FilterInput label="From Date">
            <DatePicker
              date={fromDate}
              setDate={onFromDateChange}
              placeholder="dd/mm/yyyy"
              className="h-10 w-full rounded-lg border-gray-200"
            />
          </FilterInput>
          <FilterInput label="To Date">
            <DatePicker
              date={toDate}
              setDate={onToDateChange}
              placeholder="dd/mm/yyyy"
              className="h-10 w-full rounded-lg border-gray-200"
            />
          </FilterInput>
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
            variant="outline"
            onClick={onClearFilters}
            disabled={!hasFilters}
            className="text-primary hover:bg-primary hover:text-primary-foreground h-10 rounded-lg"
          >
            <RotateCcw size={18} /> Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
}

function FilterInput({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
        {label}
      </Label>
      {children}
    </div>
  );
}
function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-2">
      <Label className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
        {label}
      </Label>
      <Select value={value || undefined} onValueChange={(nextValue) => onChange(nextValue ?? "")}>
        <SelectTrigger className="h-10! w-full rounded-lg border-gray-200">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
