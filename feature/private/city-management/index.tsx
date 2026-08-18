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
import { ROUTES } from "@/config/routes";
import {
  CITY_MANAGER_STATS_CONFIG,
  CITY_MANAGER_STATUS_OPTIONS,
} from "@/constants/city-management";
import { type CityManagerData } from "@/feature/private/city-management/types/city-manager";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { getCityManagerColumns } from "./columns/city-manager-columns";
import { AddCityManagerDialog } from "./components/add-city-manager-dialog";
import { EditCityManagerDialog } from "./components/edit-city-manager-dialog";
import { useCityManagerFilters } from "./hooks/use-city-manager-filters";

export default function CityManagementPage() {
  const {
    addCityManager,
    clearFilters,
    country,
    setCountry,
    city,
    setCity,
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
    updateCityManager,
    isLoading,
    pagination,
    searchQuery,
    setSearchQuery,
    setSorting,
    page,
    setPage,
    limit,
    setLimit,
  } = useCityManagerFilters();

  const router = useRouter();

  const [editingManager, setEditingManager] = useState<CityManagerData | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const columns = useMemo(
    () =>
      getCityManagerColumns({
        onView: (manager) => {
          router.push(`${ROUTES.ADMIN.CITY_MANAGEMENT.ROOT}/${manager.id}`);
        },
        onEdit: (manager) => {
          setEditingManager(manager);
          setIsEditOpen(true);
        },
        onToggleStatus: toggleManagerStatus,
      }),
    [router, toggleManagerStatus],
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (fromDate || toDate) count++;
    if (country && country !== "all" && country !== "All") count++;
    if (city && city !== "all" && city !== "All") count++;
    if (statusFilter && statusFilter !== "All" && statusFilter !== "all") count++;
    return count;
  }, [fromDate, toDate, country, city, statusFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="City Management"
        description="Manage city managers, assigned cities, and account status."
        action={<AddCityManagerDialog onSubmit={addCityManager} />}
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {CITY_MANAGER_STATS_CONFIG.map(({ key, label, Icon, color, bg }) => (
          <MetricStatCard
            key={key}
            label={label}
            value={stats[key]}
            icon={Icon}
            iconClassName={color}
            iconWrapperClassName={bg}
          />
        ))}
      </div>

      <ModuleFilters
        title="Filter City Managers"
        description="Refine managers by date, country, assigned city, and status"
        countryId={country}
        onCountryChange={setCountry}
        cityId={city}
        onCityChange={setCity}
        hasFilters={hasFilters}
        onClearFilters={clearFilters}
        activeFilterCount={activeFilterCount}
      >
        <div className="min-w-[280px] flex-1 sm:min-w-[320px]">
          <DateRangeFilter
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            maxDate={new Date()}
          />
        </div>

        <div className="min-w-36 flex-1 space-y-1 sm:min-w-44">
          <Label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Status
          </Label>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "All")}>
            <SelectTrigger className="h-10 w-full rounded-xl border-slate-200/80 bg-white px-3 text-sm font-medium dark:border-slate-800 dark:bg-slate-900">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {CITY_MANAGER_STATUS_OPTIONS.map((opt) => (
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
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div>
            <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              City Manager List
            </CardTitle>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {filteredData.length} manager{filteredData.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <DataTable
            columns={columns}
            data={filteredData}
            searchKey="firstName"
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

      <EditCityManagerDialog
        manager={editingManager}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSubmit={updateCityManager}
      />
    </div>
  );
}
