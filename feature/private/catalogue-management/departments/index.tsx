"use client";

import { DataTable } from "@/components/common/data-table/data-table";
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
import { CATALOGUE_STATUS_OPTIONS, DEPARTMENT_STAT_CONFIG } from "@/constants/catalogue-management";
import { useDraftTableFilters } from "@/hooks/use-table-filters";
import { Building2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/components/providers/profile-provider";
import { useCallback, useMemo, useState } from "react";
import { getDepartmentColumns } from "./columns/department-columns";
import { DepartmentFormDialog } from "./components/department-form-dialog";
import { useGetDepartments, type UseGetDepartmentsArgs } from "./hooks/use-get-departments";
import type { DepartmentData } from "./types/department.types";

export function DepartmentsManagement() {
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
  const [appliedCountry, setAppliedCountry] = useState("all");
  const [appliedCity, setAppliedCity] = useState("all");

  const applyAllFilters = () => {
    applyFilters();
    setAppliedCountry(country);
    setAppliedCity(city);
  };

  const cancelAllFilters = () => {
    cancelFilters();
    setCountry(appliedCountry);
    setCity(appliedCity);
  };
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<DepartmentData | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const router = useRouter();

  const queryArgs: UseGetDepartmentsArgs = useMemo(() => {
    return {
      page: currentPage,
      limit: pageSize,
      search: debouncedSearch || undefined,
      countryId: appliedCountry !== "all" && appliedCountry !== "All" ? appliedCountry : undefined,
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
    applied.status,
    applied.fromDate,
    applied.toDate,
    sortBy,
    sortOrder,
  ]);

  const { data: res, isLoading } = useGetDepartments(queryArgs);

  const departments = useMemo(() => {
    const rawDepartments = res?.data ?? [];
    return rawDepartments.filter((d) => {
      if (
        appliedCity !== "all" &&
        appliedCity !== "All" &&
        (d as any).cityId &&
        (d as any).cityId !== appliedCity
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
    debouncedSearch
  );

  const clearFilters = () => {
    resetBaseFilters();
    setCountry("all");
    setCity("all");
    setAppliedCountry("all");
    setAppliedCity("all");
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (applied.fromDate || applied.toDate) count++;
    if (appliedCountry !== "all" && appliedCountry !== "All") count++;
    if (appliedCity !== "all" && appliedCity !== "All") count++;
    if (applied.status !== "all") count++;
    return count;
  }, [applied.fromDate, applied.toDate, appliedCountry, appliedCity, applied.status]);

  const handleEdit = useCallback((department: DepartmentData) => {
    setEditingDepartment(department);
    setDialogOpen(true);
  }, []);

  const handleViewDetails = useCallback(
    (department: DepartmentData) => {
      router.push(`${ROUTES.ADMIN.CATALOGUE_MANAGEMENT.DEPARTMENTS}/${department.id}`);
    },
    [router],
  );

  const handleImageClick = useCallback((image: string) => {
    setLightboxSrc(image);
  }, []);

  const { profile } = useProfile();
  const isStoreManager =
    profile?.role === "store_manager" ||
    profile?.roleCode === "STORE_MANAGER" ||
    profile?.role === "store_admin" ||
    profile?.roleCode === "STORE_ADMIN";
  const isStoreScoped = isStoreManager;

  const columns = useMemo(
    () => getDepartmentColumns(handleEdit, handleViewDetails, handleImageClick, isStoreScoped),
    [handleEdit, handleViewDetails, handleImageClick, isStoreScoped],
  );

  return (
    <div className="space-y-6">
      <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />

      <PageHeader
        title="Departments"
        description="Manage all catalogue departments across countries and stores."
        action={
          <Button
            onClick={() => {
              setEditingDepartment(null);
              setDialogOpen(true);
            }}
            className="gap-2 rounded-xl"
          >
            <Plus className="h-4 w-4" />
            Add Department
          </Button>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {DEPARTMENT_STAT_CONFIG.map(({ key, label, Icon, color, bg }) => (
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
        title="Filter Departments"
        description="Refine departments by date, country, city, and status"
        countryId={country}
        onCountryChange={setCountry}
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
                    Departments
                  </CardTitle>
                </div>
                <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                  {departments.length} department{departments.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <DataTable
            columns={columns}
            data={departments}
            loading={isLoading}
            searchKey="departmentName"
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

      <DepartmentFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        department={editingDepartment}
      />
    </div>
  );
}
