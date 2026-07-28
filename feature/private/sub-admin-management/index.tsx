"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { PageHeader } from "@/components/common/page-header";
import { MetricStatCard } from "@/components/common/stats/metric-stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUB_ADMIN_STAT_CONFIG, SUB_ADMIN_STATUS_OPTIONS } from "@/constants/sub-admin-management";
import { Filter, RotateCcw } from "lucide-react";
import { subAdminColumns } from "./columns/sub-admin-columns";
import { AddSubAdminDialog } from "./components/add-sub-admin-dialog";
import { useSubAdminManagement } from "./hooks/use-sub-admin-management";

export function SubAdminManagement() {
  const {
    clearFilters,
    filteredData,
    fromDate,
    hasFilters,
    setFromDate,
    setStatusFilter,
    setToDate,
    stats,
    statusFilter,
    toDate,
  } = useSubAdminManagement();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sub Admin Management"
        description="Manage sub administrators, their roles, and module permissions."
        action={<AddSubAdminDialog />}
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {SUB_ADMIN_STAT_CONFIG.map(({ key, label, Icon, color, bg }) => (
          <MetricStatCard
            key={key}
            label={label}
            value={stats[key]}
            trendLabel="vs last month"
            trendValue="+8%"
            icon={Icon}
            iconClassName={color}
            iconWrapperClassName={bg}
          />
        ))}
      </div>

      <Card className="rounded-xl border bg-white shadow-sm">
        <CardHeader className="border-b py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
              <Filter className="text-primary h-4 w-4" />
            </div>
            <CardTitle className="text-lg font-semibold">Filter Sub Admins</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <div className="flex flex-wrap items-end gap-3 lg:flex-nowrap">
            <DateRangeFilter
              fromDate={fromDate}
              toDate={toDate}
              onFromDateChange={setFromDate}
              onToDateChange={setToDate}
              wrapperClassName="min-w-[22.5rem] flex flex-1 gap-3"
              itemClassName="min-w-45 flex-1 space-y-1"
              pickerClassName="h-10 w-full"
              labelClassName="text-muted-foreground text-xs font-medium uppercase"
            />

            <div className="min-w-45 flex-1 space-y-1">
              <Label className="text-muted-foreground text-xs font-medium uppercase">Status</Label>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "All")}>
                <SelectTrigger className="h-10! w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {SUB_ADMIN_STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Button variant="destructive" onClick={clearFilters} disabled={!hasFilters}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div>
            <CardTitle className="text-xl font-semibold">All Sub Admins</CardTitle>
            <p className="text-muted-foreground mt-0.5 text-sm">
              {filteredData.length} sub admin{filteredData.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={subAdminColumns} data={filteredData} searchKey="userName" />
        </CardContent>
      </Card>
    </div>
  );
}
