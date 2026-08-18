"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { useState } from "react";
import { completedCreditsColumns } from "./columns/completed-credits-columns";

export function CompletedCredits() {
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [country, setCountry] = useState("all");
  const [city, setCity] = useState("all");

  const hasFilters = Boolean(
    fromDate ||
    toDate ||
    (country !== "all" && country !== "All") ||
    (city !== "all" && city !== "All"),
  );

  const handleClearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setCountry("all");
    setCity("all");
  };

  const activeFilterCount =
    (fromDate || toDate ? 1 : 0) +
    (country !== "all" && country !== "All" ? 1 : 0) +
    (city !== "all" && city !== "All" ? 1 : 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Completed Credits"
        description="View and manage completed credit requests across countries and cities."
      />

      <ModuleFilters
        title="Filter Completed Credits"
        description="Filter records by date range, country, and city"
        countryId={country}
        onCountryChange={setCountry}
        cityId={city}
        onCityChange={setCity}
        hasFilters={hasFilters}
        onClearFilters={handleClearFilters}
        activeFilterCount={activeFilterCount}
      >
        <div className="min-w-[280px] flex-1 sm:min-w-[320px]">
          <DateRangeFilter
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
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
