"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { PageHeader } from "@/components/common/page-header";
import { MetricStatCard } from "@/components/common/stats/metric-stat-card";
import { StatusTabs } from "@/components/common/status-tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SUB_ADMIN_STAT_CONFIG } from "@/constants/sub-admin-management";
import { useDraftTableFilters } from "@/hooks/use-table-filters";
import type { SortingState } from "@tanstack/react-table";
import { UserCheck, Users } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
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
    currentPage,
    setCurrentPage,
    pageSize: rowsPerPage,
    setPageSize: setRowsPerPage,
    searchQuery: search,
    setSearchQuery: setSearch,
    setSorting,
    debouncedSearch,
    sortBy,
    sortOrder,
    applied,
    applyFilters,
    cancelFilters,
    resetBaseFilters,
  } = useDraftTableFilters();

  const [statusTab, setStatusTab] = useState<"all" | "ACTIVE" | "INACTIVE">("all");

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
    fromDate: applied.fromDate ? new Date(applied.fromDate) : undefined,
    toDate: applied.toDate ? new Date(applied.toDate) : undefined,
    status: statusTab !== "all" ? statusTab : undefined,
    sortBy,
    sortOrder,
  };

  const { data: res, isLoading, isFetching } = useGetSubAdmins(queryArgs);
  const allData = (res?.data ?? []) as SubAdminData[];

  const hasFilters = Boolean(applied.fromDate || applied.toDate);

  const handleReset = useCallback(() => {
    resetBaseFilters();
    setStatusTab("all");
    setCurrentPage(1);
  }, [resetBaseFilters, setCurrentPage]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (applied.fromDate || applied.toDate) count++;
    if (applied.status !== "all") count++;
    return count;
  }, [applied.fromDate, applied.toDate, applied.status]);

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
        onApplyFilters={applyFilters}
        onCancelFilters={cancelFilters}
        activeFilterCount={activeFilterCount}
      >
        <div className="min-w-[280px] flex-1 sm:min-w-[320px]">
          <DateRangeFilter
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={(d) => setFromDate(d ?? undefined)}
            onToDateChange={(d) => setToDate(d ?? undefined)}
            maxDate={new Date()}
            loading={isLoading}
          />
        </div>
      </ModuleFilters>

      <StatusTabs
        activeTab={statusTab}
        stats={{
          total: res?.stats?.total ?? 0,
          active: res?.stats?.active ?? 0,
          inactive: res?.stats?.inactive ?? 0,
        }}
        onChange={(tab) => {
          setStatusTab(tab);
          setCurrentPage(1);
        }}
        isLoading={isLoading || isFetching}
      />

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
