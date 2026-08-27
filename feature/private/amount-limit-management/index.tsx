"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { PageHeader } from "@/components/common/page-header";
import { Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockData } from "@/constants/amount-limit-management";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { amountLimitColumns } from "./columns/amount-limit-columns";
import { AmountLimitDialog } from "./components/amount-limit-dialog";
import { useFilterState } from "@/hooks/use-filter-state";
import { useMemo } from "react";

export function AmountLimitManagement() {
  const { draft, setDraft, applied, apply, cancel, reset } = useFilterState({
    fromDate: undefined as Date | undefined,
    toDate: undefined as Date | undefined,
  });

  const filteredData = useMemo(() => {
    return mockData.filter((item) => {
      const createdAt = new Date(item.createdAt);
      if (applied.fromDate && createdAt < applied.fromDate) return false;
      if (applied.toDate && createdAt > applied.toDate) return false;
      return true;
    });
  }, [applied.fromDate, applied.toDate]);

  const hasFilters = Boolean(applied.fromDate || applied.toDate);

  const activeFilterCount = applied.fromDate || applied.toDate ? 1 : 0;
  return (
    <div className="space-y-6">
      <PageHeader
        title="Amount Limit Management"
        description="Manage and configure amount limits for different countries."
        action={<AmountLimitDialog mode="add" />}
      />

      <ModuleFilters
        title="Filter Amount Limits"
        description="Filter records by date range"
        hasFilters={hasFilters}
        onClearFilters={reset}
        onApplyFilters={apply}
        onCancelFilters={cancel}
        activeFilterCount={activeFilterCount}
      >
        <div className="min-w-[280px] flex-1 sm:min-w-[320px]">
          <DateRangeFilter
            fromDate={draft.fromDate}
            toDate={draft.toDate}
            onFromDateChange={(d) => setDraft((p) => ({ ...p, fromDate: d ?? undefined }))}
            onToDateChange={(d) => setDraft((p) => ({ ...p, toDate: d ?? undefined }))}
          />
        </div>
      </ModuleFilters>

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
              <Globe className="text-primary h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">Country Amount Limits</CardTitle>
              <p className="text-muted-foreground mt-0.5 text-sm">
                {filteredData.length} amount limits found
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={amountLimitColumns} data={filteredData} searchKey="countryName" />
        </CardContent>
      </Card>
    </div>
  );
}
