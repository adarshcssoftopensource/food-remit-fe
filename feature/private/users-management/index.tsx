"use client";

import { Filter, RotateCcw, UsersRound } from "lucide-react";
import { useCallback, useState } from "react";

import { STAT_CONFIG, USER_STATUS_OPTIONS } from "@/constants/users-management";
import { useDebounce } from "@/lib/debounce";
import { usersColumns } from "./columns/users-columns";
import { useGetUsers, UseGetUsersArgs } from "./hooks/use-get-users";

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
} from "@/components/ui/select";
import { SortingState } from "@tanstack/react-table";

export function UserManagement() {
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const queryArgs: UseGetUsersArgs = {
    page: currentPage,
    limit: rowsPerPage,
    search: debouncedSearch || undefined,
    fromDate,
    toDate,
    status: status || undefined,
    sortBy: sorting[0]?.id || undefined,
    sortOrder: sorting[0]?.desc ? "desc" : sorting[0] ? "asc" : undefined,
  };

  const { data: res, isLoading } = useGetUsers(queryArgs);
  const allData = (res?.data ?? []) as any[];
  const stats = {
    total: res?.stats?.total ?? 0,
    active: res?.stats?.active ?? 0,
    inactive: res?.stats?.inactive ?? 0,
  };

  const hasFilters = !!(fromDate || toDate || status);

  const clearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setStatus(null);
    setSearch("");
    setCurrentPage(1);
    setSorting([]);
  };

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleRowsPerPageChange = useCallback((limit: number) => {
    setRowsPerPage(limit);
    setCurrentPage(1);
  }, []);

  const handleSortingChange = useCallback(
    (nextSorting: import("@tanstack/react-table").SortingState) => {
      setSorting(nextSorting);
      setCurrentPage(1);
    },
    [],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users Management"
        description="Manage and monitor all registered users in the platform."
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {STAT_CONFIG.map(({ key, label, Icon, color, bg }) => (
          <MetricStatCard
            key={key}
            label={label}
            value={stats[key]}
            icon={Icon}
            iconClassName={color}
            iconWrapperClassName={bg}
            loading={isLoading}
          />
        ))}
      </div>

      <Card className="relative overflow-hidden rounded-2xl border">
        <div className="from-primary/20 via-primary to-primary/20 absolute inset-x-0 top-0 h-0.5 bg-gray-100" />

        <CardHeader className="border-b border-slate-100 px-5 py-4 sm:px-6 dark:border-slate-800">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 ring-primary/10 flex h-10 w-10 items-center justify-center rounded-xl ring-1">
                <Filter className="text-primary h-4.5 w-4.5" />
              </div>

              <div>
                <CardTitle className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  Filter Users
                </CardTitle>

                <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                  Refine users by date and status
                </p>
              </div>
            </div>

            {hasFilters && (
              <div className="border-primary/15 bg-primary/5 hidden items-center gap-2 rounded-full border px-3 py-1.5 sm:flex">
                <span className="bg-primary h-1.5 w-1.5 rounded-full" />
                <span className="text-primary text-[11px] font-semibold">Filters active</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5">
          <div className="rounded-xl border border-slate-200/70 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
              <div className="min-w-0 flex-1">
                <DateRangeFilter
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
                  wrapperClassName="flex flex-col sm:flex-row gap-3"
                  itemClassName="flex-1 min-w-0 space-y-1.5"
                  pickerClassName="h-10 w-full rounded-lg border-slate-200 bg-white shadow-none dark:border-slate-700 dark:bg-slate-950"
                  labelClassName="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                  maxDate={new Date()}
                  loading={isLoading}
                />
              </div>

              <div className="w-full lg:w-47.5">
                <Label className="mb-1.5 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  User Status
                </Label>

                <Select
                  value={status ?? ""}
                  onValueChange={(v) => {
                    setStatus(v || null);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-10 w-full rounded-lg border-slate-200 bg-white px-3 text-sm shadow-none dark:border-slate-700 dark:bg-slate-950">
                    <span
                      className={
                        status ? "font-medium text-slate-700 dark:text-slate-200" : "text-slate-400"
                      }
                    >
                      {USER_STATUS_OPTIONS.find((option) => option.value === status)?.label ??
                        "All Users"}
                    </span>
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {USER_STATUS_OPTIONS.map((opt) => (
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
                onClick={clearFilters}
                disabled={!hasFilters}
                className="h-10 w-full shrink-0 rounded-lg border-slate-200 bg-white px-4 font-semibold text-slate-600 shadow-none transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 lg:w-auto dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                <RotateCcw className="mr-2 h-3.5 w-3.5" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_35px_-15px_rgba(15,23,42,0.14)] dark:border-slate-800 dark:bg-slate-950">
        <div className="from-primary/20 via-primary to-primary/20 absolute inset-x-0 top-0 h-0.5 bg-gray-100" />

        <CardHeader className="border-b border-slate-100 px-5 py-5 sm:px-6 dark:border-slate-800">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
              <div className="bg-primary/10 text-primary ring-primary/10 relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1">
                <UsersRound className="h-5.25 w-5.25" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-white">
                    All Users
                  </CardTitle>

                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:bg-slate-800 dark:text-slate-400">
                    Directory
                  </span>
                </div>

                <p className="mt-1 text-xs font-medium text-slate-400 sm:text-sm dark:text-slate-500">
                  Manage and monitor registered users
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-3 sm:px-5 dark:border-slate-800 dark:bg-slate-900/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary h-1.5 w-1.5 rounded-full" />

                <span className="text-[11px] font-bold tracking-[0.12em] text-slate-400 uppercase">
                  User Directory
                </span>
              </div>

              <span className="hidden text-[11px] font-medium text-slate-400 sm:block">
                Search, sort & manage users
              </span>
            </div>
          </div>

          <div className="px-3 pt-2 pb-4 sm:px-4">
            <DataTable
              columns={usersColumns}
              data={allData}
              searchKey="fullName"
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
