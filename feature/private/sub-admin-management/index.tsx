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
import { useDebounce } from "@/lib/debounce";
import type { SortingState } from "@tanstack/react-table";
import { Filter, RotateCcw, UserCheck, Users } from "lucide-react";
import { useCallback, useState } from "react";
import { subAdminColumns } from "./columns/sub-admin-columns";
import { SubAdminDialog } from "./components/sub-admin-dialog";
import { useGetSubAdmins, UseGetSubAdminsArgs } from "./hooks/use-get-sub-admins";
import type { SubAdminData } from "./types/sub-admin.types";

export function SubAdminManagement() {
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sorting, setSorting] = useState<SortingState>([]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const queryArgs: UseGetSubAdminsArgs = {
    page: currentPage,
    limit: rowsPerPage,
    search: debouncedSearch || undefined,
    fromDate,
    toDate,
    status: status || undefined,
    sortBy: sorting[0]?.id || undefined,
    sortOrder: sorting[0]?.desc ? "desc" : sorting[0] ? "asc" : undefined,
  };

  const { data: res, isLoading } = useGetSubAdmins(queryArgs);
  const allData = (res?.data ?? []) as SubAdminData[];

  const handleReset = useCallback(() => {
    setFromDate(undefined);
    setToDate(undefined);
    setStatus(null);
    setSearch("");
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleRowsPerPageChange = useCallback((limit: number) => {
    setRowsPerPage(limit);
    setCurrentPage(1);
  }, []);

  const handleSortingChange = useCallback((nextSorting: SortingState) => {
    setSorting(nextSorting);
    setCurrentPage(1);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sub Admin Management"
        description="Manage sub administrators, their roles, and module permissions."
        action={<SubAdminDialog mode="add" />}
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {SUB_ADMIN_STAT_CONFIG.map(({ key, label, Icon, color, bg }) => (
          <MetricStatCard
            key={key}
            label={label}
            value={
              key === "total"
                ? (res?.stats?.total ?? 0)
                : key === "active"
                  ? (res?.stats?.active ?? 0)
                  : key === "inactive"
                    ? (res?.stats?.inactive ?? 0)
                    : (res?.stats?.avgPermissions ?? 0)
            }
            // trendLabel="vs last month"
            // trendValue="+8%"
            icon={Icon}
            iconClassName={color}
            iconWrapperClassName={bg}
            loading={isLoading}
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
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end lg:flex-nowrap">
            <DateRangeFilter
              wrapperClassName="flex flex-col sm:flex-row flex-1 gap-3"
              itemClassName="flex-1 space-y-1 min-w-0"
              pickerClassName="h-10 w-full"
              labelClassName="text-muted-foreground text-xs font-medium uppercase"
              fromDate={fromDate}
              toDate={toDate}
              onFromDateChange={(d) => {
                setFromDate(d ?? undefined);
                setCurrentPage(1);
              }}
              onToDateChange={(d) => {
                setToDate(d ?? undefined);
                setCurrentPage(1);
              }}
              maxDate={new Date()}
              loading={isLoading}
            />

            <div className="min-w-0 flex-1 space-y-1 sm:min-w-40">
              <Label className="text-muted-foreground mt-2 text-xs font-medium uppercase">
                Filter by user status
              </Label>
              <Select
                value={status ?? ""}
                onValueChange={(v) => {
                  setStatus(v || null);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-10! w-full">
                  <SelectValue placeholder="All">
                    {SUB_ADMIN_STATUS_OPTIONS.find((opt) => opt.value === (status ?? ""))?.label ||
                      "All"}
                  </SelectValue>
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

            <Button
              variant="destructive"
              className="h-10 w-full shrink-0 sm:w-auto"
              onClick={handleReset}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="border-b bg-linear-to-r from-slate-50 via-white to-slate-50 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border">
                <Users className="h-6 w-6" />
              </div>

              <div>
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
                  All Sub Admins
                </CardTitle>

                <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                  <UserCheck className="h-4 w-4 text-emerald-500" />
                  <span>
                    <strong className="text-slate-700">{allData.length}</strong> sub-admins found
                  </span>
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <DataTable
            columns={subAdminColumns}
            data={allData}
            searchKey="userName"
            loading={isLoading}
            searchValue={search}
            onSearchChange={handleSearchChange}
            currentPage={currentPage}
            totalPages={res?.pagination?.totalPages ?? 1}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onSortingChange={handleSortingChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}
