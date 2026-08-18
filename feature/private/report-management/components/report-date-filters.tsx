"use client";

import { Filter, RotateCcw, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ReportDateFiltersProps = {
  fromDate?: Date;
  toDate?: Date;
  hasFilters: boolean;
  onFromDateChange: (date?: Date) => void;
  onToDateChange: (date?: Date) => void;
  onApply: () => void;
  onClear: () => void;
};

export function ReportDateFilters({
  fromDate,
  toDate,
  hasFilters,
  onFromDateChange,
  onToDateChange,
  onApply,
  onClear,
}: ReportDateFiltersProps) {
  return (
    <Collapsible className="group">
      <Card className="rounded-xl border bg-white shadow-sm">
        <CollapsibleTrigger render={<div />}>
          <CardHeader className="cursor-pointer border-b py-4 transition-colors hover:bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
                <Filter className="text-primary h-4 w-4" />
              </div>
              <CardTitle className="text-lg font-semibold">Filter Reports</CardTitle>

              <div className="flex items-center gap-3">
                <ChevronDown className="h-5 w-5 text-slate-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end lg:flex-nowrap">
              <DateRangeFilter
                fromDate={fromDate}
                toDate={toDate}
                onFromDateChange={onFromDateChange}
                onToDateChange={onToDateChange}
                wrapperClassName="flex flex-col sm:flex-row flex-1 gap-3"
                itemClassName="flex-1 space-y-1 min-w-0"
                pickerClassName="h-10 w-full"
                labelClassName="text-muted-foreground text-xs font-medium uppercase"
              />
              <Button onClick={onApply} className="h-10 w-full shrink-0 sm:w-auto">
                Apply
              </Button>
              <Button
                variant="destructive"
                onClick={onClear}
                disabled={!hasFilters}
                className="h-10 w-full shrink-0 sm:w-auto"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
