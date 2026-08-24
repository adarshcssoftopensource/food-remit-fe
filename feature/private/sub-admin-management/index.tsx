"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { PageHeader } from "@/components/common/page-header";
import { MetricStatCard } from "@/components/common/stats/metric-stat-card";
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
import { useTableFilters } from "@/hooks/use-table-filters";
import type { SortingState } from "@tanstack/react-table";
import { UserCheck, Users } from "lucide-react";
import { useCallback, useMemo } from "react";
import { subAdminColumns } from "./columns/sub-admin-columns";
import { SubAdminDialog } from "./components/sub-admin-dialog";
import { useGetSubAdmins, UseGetSubAdminsArgs } from "./hooks/use-get-sub-admins";
import type { SubAdminData } from "./types/sub-admin.types";

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

  const hasFilters = Boolean(fromDate || toDate || status !== "all");

  const handleReset = useCallback(() => {
    setFromDate(undefined);
    setToDate(undefined);
    setStatus("all");
    setSearch("");
    setCurrentPage(1);
  }, [setFromDate, setToDate, setStatus, setSearch, setCurrentPage]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (fromDate || toDate) count++;
    if (status !== "all") count++;
    return count;
  }, [fromDate, toDate, status]);

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
        title="Sub/Co Admin Management"
        description="Manage sub/co administrators, their roles, and module permissions."
        action={<SubAdminDialog mode="add" />}
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        {SUB_ADMIN_STAT_CONFIG.map(({ key, label, Icon, color, bg }) => (
          <MetricStatCard
            key={key}
            label={label}
            value={
              key === "subAdmins"
                ? (res?.stats?.subAdmins ?? 0)
                : key === "coAdmins"
                  ? (res?.stats?.coAdmins ?? 0)
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

      <ModuleFilters
        title="Filter Sub/Co Admins"
        description="Refine administrators by date and status"
        hideCountryFilter
        hideCityFilter
        hasFilters={hasFilters}
        onClearFilters={handleReset}
        activeFilterCount={activeFilterCount}
      >
        <div className="min-w-[280px] flex-1 sm:min-w-[320px]">
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
            maxDate={new Date()}
            loading={isLoading}
          />
        </div>

        <div className="min-w-36 flex-1 space-y-1 sm:min-w-44">
          <Label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Admin Status
          </Label>
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v as string);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-10 w-full rounded-xl border-slate-200/80 bg-white px-3 text-sm font-medium dark:border-slate-800 dark:bg-slate-900">
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
      </ModuleFilters>

      <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
        <CardHeader className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary ring-primary/20 flex size-10 items-center justify-center rounded-xl ring-1">
                <Users className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  All Sub/Co Admins
                </CardTitle>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    <strong className="font-bold text-slate-700 dark:text-slate-200">
                      {allData.length}
                    </strong>{" "}
                    administrators found
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
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
