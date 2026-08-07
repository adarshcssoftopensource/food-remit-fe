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

      <Card className="rounded-xl border bg-white shadow-sm">
        <CardHeader className="border-b py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
              <Filter className="text-primary h-4 w-4" />
            </div>
            <CardTitle className="text-lg font-semibold">Filter Users</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end lg:flex-nowrap">
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
              wrapperClassName="flex flex-col sm:flex-row flex-1 gap-3"
              itemClassName="flex-1 space-y-1 min-w-0"
              pickerClassName="h-10 w-full"
              labelClassName="text-muted-foreground text-xs font-medium uppercase"
              maxDate={new Date()}
              loading={isLoading}
            />

            <div className="min-w-0 flex-1 sm:min-w-[160px]">
              <Label className="text-muted-foreground text-xs font-medium uppercase">
                User Status
              </Label>

              <Select
                value={status ?? ""}
                onValueChange={(v) => {
                  setStatus(v || null);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-10! w-full">
                  <span className={status ? undefined : "text-muted-foreground"}>
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
              variant="destructive"
              onClick={clearFilters}
              disabled={!hasFilters}
              className="h-10 w-full shrink-0 px-5 sm:w-auto"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between rounded-t-xl border-b bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl">
              <UsersRound className="h-6 w-6" />
            </div>

            <div>
              <CardTitle className="text-xl font-bold tracking-tight text-slate-800">
                All Users
              </CardTitle>

              <p className="mt-1 text-sm text-slate-500">Manage and monitor registered users</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
