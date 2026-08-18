"use client";

import { Filter, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

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
import { ROUTES } from "@/config/routes";
import {
  COUNTRY_MANAGER_STATS_CONFIG,
  COUNTRY_MANAGER_STATUS_OPTIONS,
} from "@/constants/country-management";
import { type CountryManagerData } from "@/feature/private/country-management/types/country-manager";
import { useRouter } from "next/navigation";
import { getCountryManagerColumns } from "./columns/country-manager-columns";
import { AddCountryManagerDialog } from "./components/add-country-manager-dialog";
import { EditCountryManagerDialog } from "./components/edit-country-manager-dialog";
import { useCountryManagerFilters } from "./hooks/use-country-manager-filters";

export default function CountryManagementPage() {
  const {
    addCountryManager,
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
    toggleManagerStatus,
    updateCountryManager,
    isLoading,
    pagination,
    searchQuery,
    setSearchQuery,
    setSorting,
    page,
    setPage,
    limit,
    setLimit,
  } = useCountryManagerFilters();

  const router = useRouter();

  const [editingManager, setEditingManager] = useState<CountryManagerData | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const columns = useMemo(
    () =>
      getCountryManagerColumns({
        onView: (manager) => {
          router.push(`${ROUTES.ADMIN.COUNTRY_MANAGEMENT.ROOT}/${manager.id}`);
        },
        onEdit: (manager) => {
          setEditingManager(manager);
          setIsEditOpen(true);
        },
        onToggleStatus: toggleManagerStatus,
      }),
    [router, toggleManagerStatus],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Country Management"
        description="Manage country managers, assignments, and account status with streamlined controls."
        action={<AddCountryManagerDialog onSubmit={addCountryManager} />}
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {COUNTRY_MANAGER_STATS_CONFIG.map(({ key, label, Icon, color, bg }) => (
          <MetricStatCard
            key={key}
            label={label}
            value={stats[key]}
            trendLabel="updated today"
            trendValue="+4%"
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
            <CardTitle className="text-lg font-semibold">Filter Country Managers</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end lg:flex-nowrap">
            <DateRangeFilter
              fromDate={fromDate}
              toDate={toDate}
              onFromDateChange={setFromDate}
              onToDateChange={setToDate}
              wrapperClassName="flex flex-col sm:flex-row flex-1 gap-3"
              itemClassName="flex-1 space-y-1 min-w-0"
              pickerClassName="h-10 w-full"
              labelClassName="text-muted-foreground text-xs font-medium uppercase"
              maxDate={new Date()}
            />

            <div className="min-w-0 flex-1 space-y-1 sm:min-w-40">
              <Label className="text-muted-foreground text-xs font-medium uppercase">Status</Label>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "All")}>
                <SelectTrigger className="h-10! w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {COUNTRY_MANAGER_STATUS_OPTIONS.map((opt) => (
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
              className="h-10 w-full shrink-0 sm:w-auto"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div>
            <CardTitle className="text-xl font-semibold">Country Manager List</CardTitle>
            <p className="text-muted-foreground mt-0.5 text-sm">
              {pagination?.total ?? 0} manager{pagination?.total !== 1 ? "s" : ""} found
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredData}
            searchKey="name"
            loading={isLoading}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            manualSorting={true}
            onSortingChange={setSorting}
            currentPage={page}
            totalPages={pagination?.totalPages ?? 1}
            rowsPerPage={limit}
            onPageChange={setPage}
            onRowsPerPageChange={setLimit}
            manualFiltering={true}
          />
        </CardContent>
      </Card>

      <EditCountryManagerDialog
        manager={editingManager}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSubmit={updateCountryManager}
      />
    </div>
  );
}
