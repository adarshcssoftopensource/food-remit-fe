"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { DepartmentSelect } from "@/components/common/department-select";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { ModuleFilters } from "@/components/common/filters/module-filters";
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
import { useTableFilters } from "@/hooks/use-table-filters";
import { Building2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { getCategoryColumns } from "./columns/category-columns";
import { CategoryFormDialog } from "./components/category-form-dialog";
import { useGetCategories, type UseGetCategoriesArgs } from "./hooks/use-get-categories";
import type { CategoryData } from "./types/category.types";

export function CategoriesManagement() {
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
    formattedFromDate,
    formattedToDate,
    sortBy,
    sortOrder,
  } = useTableFilters();

  const [country, setCountry] = useState("all");
  const [city, setCity] = useState("all");
  const [department, setDepartment] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);

  const router = useRouter();

  const queryArgs: UseGetCategoriesArgs = useMemo(() => {
    return {
      page: currentPage,
      limit: pageSize,
      search: debouncedSearch || undefined,
      countryId: country !== "all" && country !== "All" ? country : undefined,
      departmentId: department !== "all" ? department : undefined,
      status: status !== "all" ? status : undefined,
      fromDate: formattedFromDate,
      toDate: formattedToDate,
      sortBy,
      sortOrder,
    };
  }, [
    currentPage,
    pageSize,
    debouncedSearch,
    country,
    department,
    status,
    formattedFromDate,
    formattedToDate,
    sortBy,
    sortOrder,
  ]);

  const { data: res, isLoading } = useGetCategories(queryArgs);

  const categories = useMemo(() => {
    const rawCategories = res?.data ?? [];
    return rawCategories.filter((c) => {
      if (city !== "all" && city !== "All" && (c as any).cityId && (c as any).cityId !== city) {
        return false;
      }
      return true;
    });
  }, [res?.data, city]);

  const stats = {
    total: res?.stats?.total ?? 0,
    active: res?.stats?.active ?? 0,
    inactive: res?.stats?.inactive ?? 0,
  };

  const hasFilters = !!(
    fromDate ||
    toDate ||
    status !== "all" ||
    country !== "all" ||
    city !== "all" ||
    department !== "all" ||
    searchQuery
  );

  const clearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setStatus("all");
    setCountry("all");
    setCity("all");
    setDepartment("all");
    setSearchQuery("");
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (fromDate || toDate) count++;
    if (country !== "all" && country !== "All") count++;
    if (city !== "all" && city !== "All") count++;
    if (department !== "all") count++;
    if (status !== "all") count++;
    return count;
  }, [fromDate, toDate, country, city, department, status]);

  const handleEdit = useCallback((dept: CategoryData) => {
    setEditingCategory(dept);
    setDialogOpen(true);
  }, []);

  const handleView = useCallback(
    (dept: CategoryData) => {
      router.push(`${ROUTES.ADMIN.CATALOGUE_MANAGEMENT.CATEGORIES}/${dept.id}`);
    },
    [router],
  );

  const columns = useMemo(
    () => getCategoryColumns(handleEdit, handleView),
    [handleEdit, handleView],
  );

  return (
    <div className="space-y-6">
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
        hasFilters={hasFilters}
        onClearFilters={clearFilters}
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
            disabled={country === "all"}
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
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:bg-slate-800 dark:text-slate-400">
                    Directory
                  </span>
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
