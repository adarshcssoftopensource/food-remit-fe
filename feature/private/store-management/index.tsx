"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { MetricStatCard } from "@/components/common/stats/metric-stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { STORE_STAT_CONFIG } from "@/constants/store-management";
import { Store } from "lucide-react";
import { storeColumns } from "./columns/store-columns";
import { AddStoreDialog } from "./components/add-store-dialog";
import { StoreFilters } from "./components/store-filters";
import { useStoreFilters } from "./hooks/useStoreFilters";

export function StoreManagement() {
  const {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    country,
    setCountry,
    city,
    setCity,
    statusFilter,
    setStatusFilter,
    filteredData,
    stats,
    hasFilters,
    clearFilters,
  } = useStoreFilters();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Store Management"
        description="Manage and monitor all registered stores, their managers and commission settings."
        action={<AddStoreDialog />}
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {STORE_STAT_CONFIG.map(({ key, label, Icon, color, bg }) => (
          <MetricStatCard
            key={key}
            label={label}
            value={stats[key]}
            trendLabel="vs last month"
            trendValue="+5%"
            icon={Icon}
            iconClassName={color}
            iconWrapperClassName={bg}
          />
        ))}
      </div>

      <Card className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <StoreFilters
          fromDate={fromDate}
          toDate={toDate}
          country={country}
          city={city}
          statusFilter={statusFilter}
          hasFilters={hasFilters}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          onCountryChange={setCountry}
          onCityChange={setCity}
          onStatusFilterChange={setStatusFilter}
          onClearFilters={clearFilters}
        />
      </Card>

      <Card className="overflow-hidden rounded-xl shadow-sm">
        <CardHeader className="bg-muted/20 flex items-center justify-between border-b px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
              <Store className="text-primary h-6 w-6" />
            </div>

            <div>
              <CardTitle className="text-2xl font-bold tracking-tight">Stores</CardTitle>

              <p className="text-muted-foreground mt-1 text-sm">
                Manage all store locations • {filteredData.length}{" "}
                {filteredData.length === 1 ? "Store" : "Stores"}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <DataTable columns={storeColumns} data={filteredData} searchKey="storeName" />
        </CardContent>
      </Card>
    </div>
  );
}
