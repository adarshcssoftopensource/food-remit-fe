"use client";

import { useMemo, useState } from "react";
import { Filter, Plus, RotateCcw } from "lucide-react";
import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MOCK_SUB_ADMINS,
  SUB_ADMIN_STAT_CONFIG,
  SUB_ADMIN_STATUS_OPTIONS,
  type SubAdminData,
} from "@/constants/sub-admin-management";
import { subAdminColumns } from "./columns/sub-admin-columns";
import { Label } from "@/components/ui/label";

export function SubAdminManagement() {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredData = useMemo<SubAdminData[]>(() => {
    return MOCK_SUB_ADMINS.filter((admin) => {
      if (statusFilter !== "All" && admin.status !== statusFilter) return false;
      const date = new Date(admin.createdAt);
      if (fromDate && date < fromDate) return false;
      if (toDate && date > toDate) return false;
      return true;
    });
  }, [statusFilter, fromDate, toDate]);

  const stats = {
    total: MOCK_SUB_ADMINS.length,
    active: MOCK_SUB_ADMINS.filter((a) => a.status === "Active").length,
    inactive: MOCK_SUB_ADMINS.filter((a) => a.status === "Inactive").length,
    permissions: Math.round(
      MOCK_SUB_ADMINS.reduce((sum, a) => sum + a.permissions.length, 0) / MOCK_SUB_ADMINS.length,
    ),
  };

  const hasFilters = !!(fromDate || toDate || statusFilter !== "All");

  const clearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setStatusFilter("All");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sub Admin Management"
        description="Manage sub administrators, their roles, and module permissions."
        action={
          <Button>
            <Plus className="size-4" />
            Add Sub Admin
          </Button>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {SUB_ADMIN_STAT_CONFIG.map(({ key, label, Icon, color, bg }) => (
          <Card key={key} className="group overflow-hidden rounded-2xl">
            <CardContent className="relative p-6">
              <div className="bg-muted/30 absolute -top-8 -right-8 h-28 w-28 rounded-full transition-transform duration-300 group-hover:scale-110" />

              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium tracking-wide">{label}</p>
                  <h2 className={`mt-2 text-4xl font-bold ${color}`}>{stats[key]}</h2>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                      +8%
                    </span>
                    <span className="text-muted-foreground text-xs">vs last month</span>
                  </div>
                </div>

                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${bg}`}>
                  <Icon className={`h-8 w-8 ${color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
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
