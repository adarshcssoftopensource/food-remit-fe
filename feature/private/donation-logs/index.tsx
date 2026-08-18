"use client";

import { ComingSoonBadge } from "@/components/common/coming-soon-badge";
import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { MetricStatCard } from "@/components/common/stats/metric-stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DONATION_STAT_CONFIG } from "@/constants/donation-logs";
import { donationColumns } from "./columns/donation-columns";
import { DonationFilters } from "./components/donation-filters";
import { useDonationLogs } from "./hooks/use-donation-logs";

export function DonationLogs() {
  const {
    filteredData,
    fromDate,
    toDate,
    statusFilter,
    country,
    city,
    stats,
    hasFilters,
    setFromDate,
    setToDate,
    setStatusFilter,
    setCountry,
    setCity,
    clearFilters,
  } = useDonationLogs();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Donation Logs"
        badge={<ComingSoonBadge />}
        description="Monitor and manage all donation transactions across the platform."
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {DONATION_STAT_CONFIG.map(({ key, label, Icon, color, bg }) => (
          <MetricStatCard
            key={key}
            label={label}
            value={stats[key]}
            icon={Icon}
            iconClassName={color}
            iconWrapperClassName={bg}
          />
        ))}
      </div>

      <DonationFilters
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
        onStatusChange={setStatusFilter}
        onClearFilters={clearFilters}
      />

      <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div>
            <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              All Donations
            </CardTitle>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {filteredData.length} donation{filteredData.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <DataTable columns={donationColumns} data={filteredData} searchKey="senderFirstName" />
        </CardContent>
      </Card>
    </div>
  );
}
