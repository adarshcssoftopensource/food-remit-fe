"use client";

import { CategorySelect } from "@/components/common/category-select";
import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { ImageLightbox } from "@/components/common/image-lightbox";
import { PageHeader } from "@/components/common/page-header";
import { MetricStatCard } from "@/components/common/stats/metric-stat-card";
import { useProfile } from "@/components/providers/profile-provider";
import { StatusTabs } from "@/components/common/status-tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/config/routes";
import { ITEM_STAT_CONFIG } from "@/constants/catalogue-management";
import { useDraftTableFilters } from "@/hooks/use-table-filters";
import { Package, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { CategoryPickerDialog } from "../categories/components/category-picker-dialog";
import { getItemColumns } from "./columns/item-columns";
import { ItemCsvToolbar } from "./components/item-csv-toolbar";
import { useGetItems } from "./hooks/use-get-items";
import { ItemData } from "./types/item.types";

export function ItemsManagement() {
  const { profile, needsBankVerification, canViewPlatformFees } = useProfile();
  const isStoreManager =
    profile?.role === "store_manager" ||
    profile?.roleCode === "STORE_MANAGER" ||
    profile?.role === "store_admin" ||
    profile?.roleCode === "STORE_ADMIN";
  const canWrite = !needsBankVerification;
  const {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    page,
    setPage,
    limit,
    setLimit,
    searchQuery: search,
    setSearchQuery: setSearch,
    debouncedSearch,
    applied,
    applyFilters,
    cancelFilters,
    resetBaseFilters,
  } = useDraftTableFilters();

  const router = useRouter();
  const [country, setCountry] = useState("all");
  const [city, setCity] = useState("all");
  const [category, setCategory] = useState("all");

  const [appliedCountry, setAppliedCountry] = useState("all");
  const [appliedCity, setAppliedCity] = useState("all");
  const [appliedCategory, setAppliedCategory] = useState("all");

  const applyAllFilters = () => {
    applyFilters();
    setAppliedCountry(country);
    setAppliedCity(city);
    setAppliedCategory(category);
  };

  const cancelAllFilters = () => {
    cancelFilters();
    setCountry(appliedCountry);
    setCity(appliedCity);
    setCategory(appliedCategory);
  };
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);
  const [isOpeningEditor, startNavigation] = useTransition();
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [statusTab, setStatusTab] = useState<"all" | "ACTIVE" | "INACTIVE">("all");
  const {
    data: itemsResponse,
    isLoading,
    isFetching,
  } = useGetItems({
    page,
    limit,
    search: debouncedSearch,
    countryId: appliedCountry !== "all" ? appliedCountry : undefined,
    cityId: appliedCity !== "all" ? appliedCity : undefined,
    categoryId: appliedCategory !== "all" ? appliedCategory : undefined,
    status: statusTab !== "all" ? statusTab : undefined,
    fromDate: applied.fromDate ? new Date(applied.fromDate).toISOString() : undefined,
    toDate: applied.toDate ? new Date(applied.toDate).toISOString() : undefined,
  });

  const filteredData = useMemo(() => itemsResponse?.data || [], [itemsResponse?.data]);

  const pagination = itemsResponse?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 };

  const stats = {
    total: itemsResponse?.stats?.total || 0,
    active: itemsResponse?.stats?.active || 0,
    inactive: itemsResponse?.stats?.inactive || 0,
  };

  const hasFilters = !!(
    applied.fromDate ||
    applied.toDate ||
    appliedCountry !== "all" ||
    appliedCity !== "all" ||
    appliedCategory !== "all" ||
    debouncedSearch
  );

  const clearFilters = () => {
    resetBaseFilters();
    setCountry("all");
    setCity("all");
    setCategory("all");
    setAppliedCountry("all");
    setAppliedCity("all");
    setAppliedCategory("all");
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (applied.fromDate || applied.toDate) count++;
    if (appliedCountry !== "all" && appliedCountry !== "All") count++;
    if (appliedCity !== "all" && appliedCity !== "All") count++;
    if (appliedCategory !== "all") count++;
    return count;
  }, [applied.fromDate, applied.toDate, appliedCountry, appliedCity, appliedCategory]);

  const handleEdit = useCallback(
    (item: ItemData) =>
      router.push(
        ROUTES.ADMIN.CATALOGUE_MANAGEMENT.EDIT_ITEM(
          item.id,
          ROUTES.ADMIN.CATALOGUE_MANAGEMENT.ITEMS,
        ),
      ),
    [router],
  );

  const handleViewDetails = useCallback(
    (item: ItemData) => router.push(ROUTES.ADMIN.CATALOGUE_MANAGEMENT.ITEM_DETAILS(item.id)),
    [router],
  );

  const handleImageClick = useCallback((image: string) => {
    setLightboxSrc(image);
  }, []);

  const isStoreScoped =
    profile?.role === "store_manager" ||
    profile?.role === "employee" ||
    profile?.roleCode === "STORE_MANAGER" ||
    profile?.roleCode === "EMPLOYEE";

  const columns = useMemo(
    () =>
      getItemColumns(
        handleEdit,
        handleViewDetails,
        handleImageClick,
        isStoreScoped,
        canViewPlatformFees,
      ),
    [handleEdit, handleViewDetails, handleImageClick, isStoreScoped, canViewPlatformFees],
  );

  const getRowClassName = useCallback((row: import("@tanstack/react-table").Row<ItemData>) => {
    const qty = row.original.quantityOnHand ?? row.original.stockQuantity;
    if (qty === null || qty === undefined) return undefined;
    if (qty <= 0) {
      return "bg-rose-50/30 hover:bg-rose-50/60! dark:bg-rose-950/10 dark:hover:bg-rose-950/25!";
    }
    if (qty <= 5) {
      return "bg-amber-50/30 hover:bg-amber-50/60! dark:bg-amber-950/10 dark:hover:bg-amber-950/25!";
    }
    return undefined;
  }, []);

  return (
    <div className="space-y-6">
      <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />

      <PageHeader
        title="Items"
        description="Manage all catalogue items across categories and countries."
        action={
          canWrite ? (
            <div className="flex flex-wrap items-center gap-2">
              {isStoreManager && <ItemCsvToolbar className="contents" />}
              <Button
                onClick={() => setCategoryPickerOpen(true)}
                disabled={isOpeningEditor}
                isLoading={isOpeningEditor}
                className="gap-2 rounded-xl"
              >
                {!isOpeningEditor && <Plus className="h-4 w-4" />}
                {isOpeningEditor ? "Opening…" : "Add Item"}
              </Button>
            </div>
          ) : undefined
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {ITEM_STAT_CONFIG.map(({ key, label, Icon, color, bg }) => (
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
        title="Filter Items"
        description="Refine items by date, country, city, category, and status"
        countryId={isStoreManager ? undefined : country}
        onCountryChange={
          isStoreManager
            ? undefined
            : (val) => {
                setCountry(val);
                setCategory("all");
              }
        }
        cityId={isStoreManager ? undefined : city}
        onCityChange={
          isStoreManager
            ? undefined
            : (val) => {
                setCity(val);
                setCategory("all");
              }
        }
        hasFilters={hasFilters}
        onClearFilters={clearFilters}
        onApplyFilters={applyAllFilters}
        onCancelFilters={cancelAllFilters}
        activeFilterCount={activeFilterCount}
      >
        <div className="min-w-36 flex-1 space-y-1 sm:min-w-44">
          <Label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Category
          </Label>
          <CategorySelect
            countryId={country !== "all" ? country : undefined}
            value={category === "all" ? "" : category}
            onValueChange={(val) => setCategory(val || "all")}
            placeholder="All Categories"
            disabled={country === "all" && !isStoreManager}
            className="h-10 rounded-xl px-3"
          />
        </div>
        <div className="min-w-[280px] flex-1 sm:min-w-[320px]">
          <DateRangeFilter
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
          />
        </div>
      </ModuleFilters>

      <StatusTabs
        activeTab={statusTab}
        stats={stats}
        onChange={(tab) => {
          setStatusTab(tab);
          setPage(1);
        }}
        isLoading={isLoading || isFetching}
      />

      <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
        <CardHeader className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary ring-primary/20 flex size-10 shrink-0 items-center justify-center rounded-xl ring-1">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                    All Items
                  </CardTitle>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:bg-slate-800 dark:text-slate-400">
                    Catalogue
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                  {pagination.total.toLocaleString()} {pagination.total === 1 ? "item" : "items"}
                  {hasFilters || statusTab !== "all" ? " match your filters" : " in the catalogue"}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <DataTable
            columns={columns}
            data={filteredData}
            searchKey="itemDisplayName"
            searchPlaceholder="Search by name, item number or UPC"
            emptyMessage={
              hasFilters || statusTab !== "all"
                ? "No items match your filters"
                : "No items yet — use Add Item or Import CSV to get started"
            }
            searchValue={search}
            onSearchChange={setSearch}
            loading={isLoading}
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            rowsPerPage={pagination.limit}
            onPageChange={(p) => setPage(p)}
            onRowsPerPageChange={(l) => {
              setLimit(l);
              setPage(1);
            }}
            getRowClassName={getRowClassName}
          />
        </CardContent>
      </Card>

      <CategoryPickerDialog
        open={categoryPickerOpen}
        onOpenChange={setCategoryPickerOpen}
        title="Add Item — Select Category"
        description="Items are created inside a category. Pick the category this item belongs to."
        onSelect={(selected) => {
          setCategoryPickerOpen(false);
          startNavigation(() =>
            router.push(ROUTES.ADMIN.CATALOGUE_MANAGEMENT.NEW_ITEM(selected.id)),
          );
        }}
      />
    </div>
  );
}
