"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { useState } from "react";
import { completedCreditsColumns } from "./columns/completed-credits-columns";

import { useFilterState } from "@/hooks/use-filter-state";

export function CompletedCredits() {
  const { draft, setDraft, applied, apply, cancel, reset } = useFilterState({
    fromDate: undefined as Date | undefined,
    toDate: undefined as Date | undefined,
    country: "all",
    city: "all",
  });

  const hasFilters = Boolean(
    applied.fromDate ||
    applied.toDate ||
    (applied.country !== "all" && applied.country !== "All") ||
    (applied.city !== "all" && applied.city !== "All"),
  );

  const handleClearFilters = () => {
    reset();
  };

  const activeFilterCount =
    (applied.fromDate || applied.toDate ? 1 : 0) +
    (applied.country !== "all" && applied.country !== "All" ? 1 : 0) +
    (applied.city !== "all" && applied.city !== "All" ? 1 : 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Completed Credits"
        description="View and manage completed credit requests across countries and cities."
      />

      <ModuleFilters
        title="Filter Completed Credits"
        description="Filter records by date range, country, and city"
        countryId={draft.country}
        onCountryChange={(v) => setDraft((p) => ({ ...p, country: v }))}
        cityId={draft.city}
        onCityChange={(v) => setDraft((p) => ({ ...p, city: v }))}
        hasFilters={hasFilters}
        onClearFilters={handleClearFilters}
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

      <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary ring-primary/20 flex size-10 items-center justify-center rounded-xl ring-1">
              <CreditCard className="size-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Completed Credits Registry
              </CardTitle>
              <p className="text-muted-foreground mt-0.5 text-xs">0 completed credits found</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <DataTable columns={completedCreditsColumns} data={[]} searchKey="receiverName" />
        </CardContent>
      </Card>
    </div>
  );
}
