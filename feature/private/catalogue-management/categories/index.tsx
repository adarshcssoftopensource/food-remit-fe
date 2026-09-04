"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { DepartmentSelect } from "@/components/common/department-select";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { ImageLightbox } from "@/components/common/image-lightbox";
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
import { CATALOGUE_STATUS_OPTIONS, CATEGORY_STAT_CONFIG } from "@/constants/catalogue-management";
import { useDraftTableFilters } from "@/hooks/use-table-filters";
import { Building2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { getCategoryColumns } from "./columns/category-columns";
import { CategoryFormDialog } from "./components/category-form-dialog";
import { useGetCategories, type UseGetCategoriesArgs } from "./hooks/use-get-categories";
import { useProfile } from "@/components/providers/profile-provider";
import type { CategoryData } from "./types/category.types";

export function CategoriesManagement() {
  const { profile } = useProfile();
  const isStoreManager =
    profile?.role === "store_manager" ||
    profile?.roleCode === "STORE_MANAGER" ||
    profile?.role === "store_admin" ||
    profile?.roleCode === "STORE_ADMIN";
  const {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    status,
    setStatus,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    searchQuery,
    setSearchQuery,
    setSorting,
    debouncedSearch,
    formattedToDate,
    sortBy,
    sortOrder,
    applied,
    applyFilters,
    cancelFilters,
    resetBaseFilters,
  } = useDraftTableFilters();

  const [country, setCountry] = useState("all");
  const [city, setCity] = useState("all");
  const [department, setDepartment] = useState("all");

  const [appliedCountry, setAppliedCountry] = useState("all");
  const [appliedCity, setAppliedCity] = useState("all");
  const [appliedDepartment, setAppliedDepartment] = useState("all");

  const applyAllFilters = () => {
    applyFilters();
    setAppliedCountry(country);
    setAppliedCity(city);
    setAppliedDepartment(department);
  };

  const cancelAllFilters = () => {
    cancelFilters();
    setCountry(appliedCountry);
    setCity(appliedCity);
    setDepartment(appliedDepartment);
  };
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const router = useRouter();

  const queryArgs: UseGetCategoriesArgs = useMemo(() => {
    return {
      page: currentPage,
      limit: pageSize,
      search: debouncedSearch || undefined,
      countryId: appliedCountry !== "all" && appliedCountry !== "All" ? appliedCountry : undefined,
      departmentId: appliedDepartment !== "all" ? appliedDepartment : undefined,
      status: applied.status !== "all" ? applied.status : undefined,
      fromDate: applied.fromDate ? new Date(applied.fromDate).toISOString() : undefined,
      toDate: applied.toDate ? new Date(applied.toDate).toISOString() : undefined,
      sortBy,
      sortOrder,
    };
  }, [
    currentPage,
    pageSize,
    debouncedSearch,
    appliedCountry,
    appliedDepartment,
    applied.status,
    applied.fromDate,
    applied.toDate,
    sortBy,
    sortOrder,
  ]);

  const { data: res, isLoading } = useGetCategories(queryArgs);

  const categories = useMemo(() => {
    const rawCategories = res?.data ?? [];
    return rawCategories.filter((c) => {
      if (
        appliedCity !== "all" &&
        appliedCity !== "All" &&
        (c as any).cityId &&
        (c as any).cityId !== appliedCity
      ) {
        return false;
      }
      return true;
    });
  }, [res?.data, appliedCity]);

  const stats = {
    total: res?.stats?.total ?? 0,
    active: res?.stats?.active ?? 0,
    inactive: res?.stats?.inactive ?? 0,
  };

  const hasFilters = !!(
    applied.fromDate ||
    applied.toDate ||
    applied.status !== "all" ||
    appliedCountry !== "all" ||
    appliedCity !== "all" ||
    appliedDepartment !== "all" ||
    debouncedSearch
  );

  const clearFilters = () => {
    resetBaseFilters();
    setCountry("all");
    setCity("all");
    setDepartment("all");
    setAppliedCountry("all");
    setAppliedCity("all");
    setAppliedDepartment("all");
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (applied.fromDate || applied.toDate) count++;
    if (appliedCountry !== "all" && appliedCountry !== "All") count++;
    if (appliedCity !== "all" && appliedCity !== "All") count++;
    if (appliedDepartment !== "all") count++;
    if (applied.status !== "all") count++;
    return count;
  }, [
    applied.fromDate,
    applied.toDate,
    appliedCountry,
    appliedCity,
    appliedDepartment,
    applied.status,
  ]);

  const handleEdit = useCallback((category: CategoryData) => {
    setEditingCategory(category);
    setDialogOpen(true);
  }, []);

  const handleViewDetails = useCallback(
    (category: CategoryData) => {
      router.push(`${ROUTES.ADMIN.CATALOGUE_MANAGEMENT.CATEGORIES}/${category.id}`);
    },
    [router],
  );

  const handleImageClick = useCallback((image: string) => {
    setLightboxSrc(image);
  }, []);

  const isStoreScoped = profile?.role === "store_manager" || profile?.roleCode === "STORE_MANAGER";

  const columns = useMemo(
    () => getCategoryColumns(handleEdit, handleViewDetails, handleImageClick, isStoreScoped),
    [handleEdit, handleViewDetails, handleImageClick, isStoreScoped],
  );

  return (
    <div className="space-y-6">
      <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />

      <PageHeader
        title="Categories"
        description="Manage all catalogue categories across countries, departments, and stores."
        action={
          <Button
            onClick={() => {
              setEditingCategory(null);
              setDialogOpen(true);
            }}
            className="gap-2 rounded-xl"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {CATEGORY_STAT_CONFIG.map(({ key, label, Icon, color, bg }) => (
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
        title="Filter Categories"
        description="Refine categories by date, country, city, department, and status"
        countryId={country}
        onCountryChange={(val) => {
          setCountry(val);
          setDepartment("all");
        }}
        cityId={city}
        onCityChange={setCity}
        hideCountryFilter={isStoreManager}
        hideCityFilter={isStoreManager}
        hasFilters={hasFilters}
        onClearFilters={clearFilters}
        onApplyFilters={applyAllFilters}
        onCancelFilters={cancelAllFilters}
        activeFilterCount={activeFilterCount}
      >
        <div className="min-w-36 flex-1 space-y-1 sm:min-w-44">
          <Label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Department
          </Label>
          <DepartmentSelect
            countryId={country !== "all" ? country : undefined}
            value={department === "all" ? "" : department}
            onValueChange={(val) => setDepartment(val || "all")}
            placeholder="All Departments"
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

        <div className="min-w-36 flex-1 space-y-1 sm:min-w-44">
          <Label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Status
          </Label>
          <Select value={status} onValueChange={(v) => setStatus(v ?? "all")}>
            <SelectTrigger className="h-10 w-full rounded-xl border-slate-200/80 bg-white px-3 text-sm font-medium dark:border-slate-800 dark:bg-slate-900">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {CATALOGUE_STATUS_OPTIONS.map((opt) => (
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
              <div className="bg-primary/10 text-primary ring-primary/20 flex size-10 shrink-0 items-center justify-center rounded-xl ring-1">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                    Categories
                  </CardTitle>
                </div>
                <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                  {categories.length} categories found
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <DataTable
            columns={columns}
            data={categories}
            loading={isLoading}
            searchKey="categoryName"
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onSortingChange={setSorting}
            manualSorting
            currentPage={currentPage}
            totalPages={res?.pagination?.totalPages ?? 1}
            rowsPerPage={pageSize}
            onPageChange={setCurrentPage}
            onRowsPerPageChange={setPageSize}
          />
        </CardContent>
      </Card>

      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
      />
    </div>
  );
}
