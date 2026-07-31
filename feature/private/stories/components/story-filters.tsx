"use client";

import { Filter, RotateCcw } from "lucide-react";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";

interface StoryFiltersProps {
  fromDate?: Date;
  toDate?: Date;
  hasFilters: boolean;
  onFromDateChange: (date?: Date) => void;
  onToDateChange: (date?: Date) => void;
  onClearFilters: () => void;
}

export function StoryFilters({
  fromDate,
  toDate,
  hasFilters,
  onFromDateChange,
  onToDateChange,
  onClearFilters,
}: StoryFiltersProps) {
  return (
    <div className="p-4">
      <div className="mb-5 flex items-center gap-3">
        <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
          <Filter className="text-primary h-4 w-4" />
        </div>
        <CardTitle className="text-foreground text-base font-semibold">Filter Stories</CardTitle>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <DateRangeFilter
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={onFromDateChange}
            onToDateChange={onToDateChange}
            wrapperClassName="contents"
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
