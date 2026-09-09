"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { ImageLightbox } from "@/components/common/image-lightbox";
import { PageHeader } from "@/components/common/page-header";
import { MetricStatCard } from "@/components/common/stats/metric-stat-card";
import { StatusTabs } from "@/components/common/status-tabs";
import { successToast } from "@/components/toaster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import { CITY_MANAGER_STATS_CONFIG } from "@/constants/city-management";
import { type CityManagerData } from "@/feature/private/city-management/types/city-manager";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { getCityManagerColumns } from "./columns/city-manager-columns";
import { AddCityManagerDialog } from "./components/add-city-manager-dialog";
import { EditCityManagerDialog } from "./components/edit-city-manager-dialog";
import { useCityManagerFilters } from "./hooks/use-city-manager-filters";
import { useDeleteCityManager } from "./hooks/use-delete-city-manager";

export default function CityManagementPage() {
  const {
    addCityManager,
    clearFilters,
    applyFilters,
    cancelFilters,
    country,
    setCountry,
    city,
    setCity,
    filteredData,
    fromDate,
    hasFilters,
    setFromDate,
    setToDate,
    stats,
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
    statusTab,
    setStatusTab,
  } = useCityManagerFilters();

  const router = useRouter();

  const [editingManager, setEditingManager] = useState<CityManagerData | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deletingManager, setDeletingManager] = useState<CityManagerData | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const handleStatusTabChange = (tab: "all" | "ACTIVE" | "INACTIVE") => {
    setStatusTab(tab);
    setPage(1);
  };

  const { mutateAsync: deleteCityManager, isPending: isDeleting } = useDeleteCityManager(
    deletingManager?.id || "",
  );

  const handleDelete = async () => {
    try {
      const response = await deleteCityManager();
      setIsDeleteOpen(false);
      successToast({
        title: "City Manager Deleted",
        description: response?.message || "City manager has been deleted successfully.",
      });
      setDeletingManager(null);
    } catch {}
  };

  const handleImageClick = useCallback((image: string) => {
    setLightboxSrc(image);
  }, []);

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
    return count;
  }, [fromDate, toDate, country, city]);

  return (
    <div className="space-y-6">
      <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />

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
        onApplyFilters={applyFilters}
        onCancelFilters={cancelFilters}
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
      </ModuleFilters>

      <StatusTabs
        activeTab={statusTab}
        stats={stats}
        onChange={handleStatusTabChange}
        isLoading={isLoading}
      />

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

      <ConfirmationDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete City Manager"
        description={`Are you sure you want to delete ${deletingManager?.firstName} ${deletingManager?.lastName}? They will be moved to the Recycle Bin and can be restored later.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
    </div>
  );
}
