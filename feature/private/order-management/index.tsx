"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ORDER_SECTION_META, type OrderSectionKey } from "@/constants/order-management";
import { useMemo } from "react";
import { orderColumns } from "./columns/order-columns";
import { useOrderManagement } from "./hooks/use-order-management";

type OrdersManagementPageProps = {
  section: OrderSectionKey;
};

export function OrdersManagementPage({ section }: OrdersManagementPageProps) {
  const meta = ORDER_SECTION_META[section];
  const {
    clearFilters,
    country,
    city,
    filteredData,
    fromDate,
    hasFilters,
    setCountry,
    setCity,
    setFromDate,
    setToDate,
    toDate,
  } = useOrderManagement();

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (fromDate || toDate) count++;
    if (country && country !== "All" && country !== "all") count++;
    if (city && city !== "All" && city !== "all") count++;
    return count;
  }, [fromDate, toDate, country, city]);

  return (
    <div className="space-y-6">
      <PageHeader title="Orders Management" description={meta.description} />

      <ModuleFilters
        title="Filter Orders"
        description="Filter orders by date range, country, and city"
        countryId={country === "All" ? "all" : country}
        onCountryChange={(val) => setCountry(val === "all" ? "All" : val)}
        cityId={city === "All" ? "all" : city}
        onCityChange={(val) => setCity(val === "all" ? "All" : val)}
        hasFilters={hasFilters}
        onClearFilters={clearFilters}
        activeFilterCount={activeFilterCount}
      >
        <div className="min-w-[280px] flex-1 sm:min-w-[320px]">
          <DateRangeFilter
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            maxDate={new Date()}
          />
        </div>
      </ModuleFilters>

      <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
        <CardHeader className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                {meta.title}
              </CardTitle>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {filteredData.length} order{filteredData.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <DataTable columns={orderColumns} data={filteredData} searchKey="referenceNo" />
        </CardContent>
      </Card>
    </div>
  );
}
