"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { ImageLightbox } from "@/components/common/image-lightbox";
import { PageHeader } from "@/components/common/page-header";
import { MetricStatCard } from "@/components/common/stats/metric-stat-card";
import { successToast } from "@/components/toaster";
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
import { useCallback, useMemo, useState } from "react";
import { getCountryManagerColumns } from "./columns/country-manager-columns";
import { AddCountryManagerDialog } from "./components/add-country-manager-dialog";
import { EditCountryManagerDialog } from "./components/edit-country-manager-dialog";
import { useCountryManagerFilters } from "./hooks/use-country-manager-filters";
import { useDeleteCountryManager } from "./hooks/use-delete-country-manager";

export default function CountryManagementPage() {
  const {
    addCountryManager,
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
  const [deletingManager, setDeletingManager] = useState<CountryManagerData | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const { mutateAsync: deleteCountryManager, isPending: isDeleting } = useDeleteCountryManager(
    deletingManager?.id || "",
  );

  const handleDelete = async () => {
    try {
      const response = await deleteCountryManager();
      setIsDeleteOpen(false);
      successToast({
        title: "Country Manager Deleted",
        description: response?.message || "Country manager has been deleted successfully.",
      });
      setDeletingManager(null);
    } catch {}
  };

  const handleImageClick = useCallback((image: string) => {
    setLightboxSrc(image);
  }, []);

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
        onDelete: (manager) => {
          setDeletingManager(manager);
          setIsDeleteOpen(true);
        },
        onToggleStatus: toggleManagerStatus,
        onImageClick: handleImageClick,
      }),
    [router, toggleManagerStatus, handleImageClick],
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
      <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />

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
            icon={Icon}
            iconClassName={color}
            iconWrapperClassName={bg}
          />
        ))}
      </div>

      <ModuleFilters
        title="Filter Country Managers"
        description="Refine country managers by date, country, and status"
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
                {COUNTRY_MANAGER_STATUS_OPTIONS.map((opt) => (
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
              Country Manager List
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

      <ConfirmationDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Country Manager"
        description={`Are you sure you want to delete ${deletingManager?.firstName} ${deletingManager?.lastName}? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
    </div>
  );
}
