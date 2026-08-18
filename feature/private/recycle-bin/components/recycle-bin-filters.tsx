"use client";

import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { USER_STATUS_OPTIONS } from "@/constants/users-management";
import { Filter, RotateCcw } from "lucide-react";
import { RecycleBinFiltersProps } from "../types/recycle-bin.types";

export function RecycleBinFilters({
  fromDate,
  toDate,
  status,
  isLoading,
  hasFilters,
  onFromDateChange,
  onToDateChange,
  onStatusChange,
  onClearFilters,
}: RecycleBinFiltersProps) {
  return (
    <Card className="relative overflow-hidden rounded-2xl border">
      <div className="from-primary/20 via-primary to-primary/20 absolute inset-x-0 top-0 h-0.5 bg-gray-100" />

      <CardHeader className="border-b border-slate-100 px-5 py-4 sm:px-6 dark:border-slate-800">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 ring-primary/10 flex h-10 w-10 items-center justify-center rounded-xl ring-1">
              <Filter className="text-primary h-4.5 w-4.5" />
            </div>

            <div>
              <CardTitle className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                Filter Users
              </CardTitle>

              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                Refine users by date and status
              </p>
            </div>
          </div>

          {hasFilters && (
            <div className="border-primary/15 bg-primary/5 hidden items-center gap-2 rounded-full border px-3 py-1.5 sm:flex">
              <span className="bg-primary h-1.5 w-1.5 rounded-full" />
              <span className="text-primary text-[11px] font-semibold">Filters active</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        <div className="rounded-xl border border-slate-200/70 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <div className="min-w-0 flex-1">
              <DateRangeFilter
                fromDate={fromDate}
                toDate={toDate}
                onFromDateChange={onFromDateChange}
                onToDateChange={onToDateChange}
                wrapperClassName="flex flex-col sm:flex-row gap-3"
                itemClassName="flex-1 min-w-0 space-y-1.5"
                pickerClassName="h-10 w-full rounded-lg border-slate-200 bg-white shadow-none dark:border-slate-700 dark:bg-slate-950"
                labelClassName="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                maxDate={new Date()}
                loading={isLoading}
              />
            </div>

            <div className="w-full lg:w-47.5">
              <Label className="mb-1.5 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                User Status
              </Label>

              <Select value={status ?? ""} onValueChange={(v) => onStatusChange(v || null)}>
                <SelectTrigger className="h-10 w-full rounded-lg border-slate-200 bg-white px-3 text-sm shadow-none dark:border-slate-700 dark:bg-slate-950">
                  <span
                    className={
                      status ? "font-medium text-slate-700 dark:text-slate-200" : "text-slate-400"
                    }
                  >
                    {USER_STATUS_OPTIONS.find((option) => option.value === status)?.label ??
                      "All Users"}
                  </span>
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {USER_STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              onClick={onClearFilters}
              disabled={!hasFilters}
              className="h-10 w-full shrink-0 rounded-lg border-slate-200 bg-white px-4 font-semibold text-slate-600 shadow-none transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 lg:w-auto dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              <RotateCcw className="mr-2 h-3.5 w-3.5" />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
