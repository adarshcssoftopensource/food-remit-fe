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
import type { SortingState } from "@tanstack/react-table";
import { Filter, RotateCcw, UserCheck, Users } from "lucide-react";
import { useCallback } from "react";
import { subAdminColumns } from "./columns/sub-admin-columns";
import { SubAdminDialog } from "./components/sub-admin-dialog";
import { useGetSubAdmins, UseGetSubAdminsArgs } from "./hooks/use-get-sub-admins";
import type { SubAdminData } from "./types/sub-admin.types";
import { useTableFilters } from "@/hooks/use-table-filters";

export function SubAdminManagement() {
  const {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    status,
    setStatus,
    currentPage,
    setCurrentPage,
    pageSize: rowsPerPage,
    setPageSize: setRowsPerPage,
    searchQuery: search,
    setSearchQuery: setSearch,
    setSorting,
    debouncedSearch,
    formattedFromDate,
    formattedToDate,
    sortBy,
    sortOrder,
  } = useTableFilters();

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
      setCurrentPage(1);
    },
    [setSearch, setCurrentPage],
  );

  const queryArgs: UseGetSubAdminsArgs = {
    page: currentPage,
    limit: rowsPerPage,
    search: debouncedSearch || undefined,
    fromDate: formattedFromDate ? new Date(formattedFromDate) : undefined,
    toDate: formattedToDate ? new Date(formattedToDate) : undefined,
    status: status !== "all" ? status : undefined,
    sortBy,
    sortOrder,
  };

  const { data: res, isLoading } = useGetSubAdmins(queryArgs);
  const allData = (res?.data ?? []) as SubAdminData[];

  const handleReset = useCallback(() => {
    setFromDate(undefined);
    setToDate(undefined);
    setStatus("all");
    setSearch("");
    setCurrentPage(1);
  }, [setFromDate, setToDate, setStatus, setSearch, setCurrentPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
    },
    [setCurrentPage],
  );

  const handleRowsPerPageChange = useCallback(
    (limit: number) => {
      setRowsPerPage(limit);
      setCurrentPage(1);
    },
    [setRowsPerPage, setCurrentPage],
  );

  const handleSortingChange = useCallback(
    (nextSorting: SortingState) => {
      setSorting(nextSorting);
      setCurrentPage(1);
    },
    [setSorting, setCurrentPage],
  );

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
            icon={Icon}
            iconClassName={color}
            iconWrapperClassName={bg}
            loading={isLoading}
          />
        ))}
      </div>

      <Card className="relative overflow-hidden rounded-2xl border border-slate-200/80">
        <div className="from-primary/10 via-primary to-primary/10 absolute inset-x-0 top-0 h-0.5 bg-gray-100" />

        <CardHeader className="border-b border-slate-100 px-5 py-4 sm:px-6 dark:border-slate-800">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary ring-primary/10 flex h-10 w-10 items-center justify-center rounded-xl ring-1">
                <Filter className="h-4.5 w-4.5" />
              </div>

              <div>
                <CardTitle className="text-base font-bold tracking-tight text-slate-900 sm:text-lg dark:text-white">
                  Filter Sub Admins
                </CardTitle>

                <p className="mt-0.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                  Refine administrators by date and status
                </p>
              </div>
            </div>

            {(fromDate || toDate || status) && (
              <div className="border-primary/15 bg-primary/5 hidden items-center gap-2 rounded-full border px-3 py-1.5 sm:flex">
                <span className="bg-primary h-1.5 w-1.5 rounded-full" />

                <span className="text-primary text-[11px] font-semibold">Filters applied</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5">
          <div className="rounded-xl border border-slate-200/70 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
              <div className="min-w-0 flex-1">
                <DateRangeFilter
                  wrapperClassName="flex flex-col sm:flex-row gap-3"
                  itemClassName="flex-1 min-w-0 space-y-1.5"
                  pickerClassName="h-10 w-full rounded-lg border-slate-200 bg-white shadow-none dark:border-slate-700 dark:bg-slate-950"
                  labelClassName="text-[10px] font-bold uppercase tracking-wider text-slate-400"
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
              </div>

              <div className="w-full lg:w-50">
                <Label className="mb-1.5 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Admin Status
                </Label>

                <Select
                  value={status}
                  onValueChange={(v) => {
                    setStatus(v as string);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-10 w-full rounded-lg border-slate-200 bg-white px-3 text-sm font-medium shadow-none dark:border-slate-700 dark:bg-slate-950">
                    <SelectValue placeholder="All">
                      {SUB_ADMIN_STATUS_OPTIONS.find((opt) => opt.value === status)?.label || "All"}
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
                variant="outline"
                className="h-10 w-full shrink-0 rounded-lg border-slate-200 bg-white px-4 font-semibold text-slate-600 shadow-none hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 lg:w-auto dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
                onClick={handleReset}
                disabled={!fromDate && !toDate && status === "all"}
              >
                <RotateCcw className="mr-2 h-3.5 w-3.5" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_35px_-15px_rgba(15,23,42,0.14)] dark:border-slate-800 dark:bg-slate-950">
        <div className="from-primary/10 via-primary to-primary/10 absolute inset-x-0 top-0 h-0.5 bg-gray-100" />

        <CardHeader className="border-b border-slate-100 px-5 py-5 sm:px-6 dark:border-slate-800">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
              <div className="bg-primary/10 text-primary ring-primary/10 relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1">
                <Users className="h-5.25 w-5.25" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-white">
                    All Sub Admins
                  </CardTitle>

                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:bg-slate-800 dark:text-slate-400">
                    Administration
                  </span>
                </div>

                <div className="mt-1.5 flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5 text-emerald-500" />

                  <p className="text-xs font-medium text-slate-400 sm:text-sm dark:text-slate-500">
                    <strong className="font-bold text-slate-700 dark:text-slate-200">
                      {allData.length}
                    </strong>{" "}
                    sub-admins found
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-4 py-3 sm:px-5 dark:border-slate-800 dark:bg-slate-900/30">
            <div className="flex items-center gap-2">
              <span className="bg-primary h-1.5 w-1.5 rounded-full" />

              <span className="text-[10px] font-bold tracking-[0.14em] text-slate-400 uppercase">
                Sub Admin Directory
              </span>
            </div>

            <span className="hidden text-[11px] font-medium text-slate-400 sm:block">
              Search, sort & manage
            </span>
          </div>

          <div className="px-3 pt-2 pb-4 sm:px-4">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
