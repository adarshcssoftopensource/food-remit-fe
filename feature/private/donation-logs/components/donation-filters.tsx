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
import { DONATION_STATUS_OPTIONS } from "@/constants/donation-logs";
import { Filter, RotateCcw } from "lucide-react";

interface DonationFiltersProps {
  fromDate?: Date;
  toDate?: Date;
  statusFilter: string;
  hasFilters: boolean;
  onFromDateChange: (date?: Date) => void;
  onToDateChange: (date?: Date) => void;
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
}

export function DonationFilters({
  fromDate,
  toDate,
  statusFilter,
  hasFilters,
  onFromDateChange,
  onToDateChange,
  onStatusChange,
  onClearFilters,
}: DonationFiltersProps) {
  return (
    <div className="p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
          <Filter className="text-primary h-4 w-4" />
        </div>
        <CardTitle className="text-base font-semibold">Filter Donation Logs</CardTitle>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end lg:flex-nowrap">
        <DateRangeFilter
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={onFromDateChange}
          onToDateChange={onToDateChange}
          wrapperClassName="flex flex-col sm:flex-row flex-1 gap-3"
          itemClassName="flex-1 min-w-0 space-y-1"
          pickerClassName="h-10 w-full"
          labelClassName="text-muted-foreground text-xs font-medium uppercase"
        />

        <div className="min-w-0 flex-1 space-y-1 sm:min-w-45">
          <Label className="text-muted-foreground text-xs font-medium uppercase">
            Donation Status
          </Label>
          <Select value={statusFilter} onValueChange={(v) => onStatusChange(v ?? "All")}>
            <SelectTrigger className="h-10! w-full">
              <SelectValue>
                {DONATION_STATUS_OPTIONS.find((opt) => opt.value === statusFilter)?.label || "All"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {DONATION_STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="destructive"
          onClick={onClearFilters}
          disabled={!hasFilters}
          className="h-10 w-full shrink-0 px-5 sm:w-auto"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}
