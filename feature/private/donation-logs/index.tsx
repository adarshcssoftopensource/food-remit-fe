"use client";

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
    stats,
    hasFilters,
    setFromDate,
    setToDate,
    setStatusFilter,
    clearFilters,
  } = useDonationLogs();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Donation Logs"
        description="Monitor and manage all donation transactions across the platform."
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {DONATION_STAT_CONFIG.map(({ key, label, Icon, color, bg }) => (
          <MetricStatCard
            key={key}
            label={label}
            value={stats[key]}
            trendLabel="vs last month"
            trendValue="+12%"
            icon={Icon}
            iconClassName={color}
            iconWrapperClassName={bg}
          />
        ))}
      </div>

      <Card className="rounded-xl border bg-white shadow-sm">
        <DonationFilters
          fromDate={fromDate}
          toDate={toDate}
          statusFilter={statusFilter}
          hasFilters={hasFilters}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          onStatusChange={setStatusFilter}
          onClearFilters={clearFilters}
        />
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div>
            <CardTitle className="text-xl font-semibold">All Donations</CardTitle>
            <p className="text-muted-foreground mt-0.5 text-sm">
              {filteredData.length} donation{filteredData.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={donationColumns} data={[]} searchKey="senderFirstName" />
        </CardContent>
      </Card>
    </div>
  );
}
