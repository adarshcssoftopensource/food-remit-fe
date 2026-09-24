"use client";

import { CategorySelect } from "@/components/common/category-select";
import { DataTable } from "@/components/common/data-table/data-table";
import { DepartmentSelect } from "@/components/common/department-select";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { ImageLightbox } from "@/components/common/image-lightbox";
import { PageHeader } from "@/components/common/page-header";
import { MetricStatCard } from "@/components/common/stats/metric-stat-card";
import { useProfile } from "@/components/providers/profile-provider";
import { errorToast } from "@/components/toaster";
import { StatusTabs } from "@/components/common/status-tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/config/routes";
import { ITEM_STAT_CONFIG } from "@/constants/catalogue-management";
import { useDraftTableFilters } from "@/hooks/use-table-filters";
import apiClient from "@/lib/api/client";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Download, Image as ImageIcon, Package, Plus, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { getItemColumns } from "./columns/item-columns";
import { CsvFormatHelpDialog } from "./components/csv-format-help-dialog";
import { CsvImportResult, CsvImportResultDialog } from "./components/csv-import-result-dialog";
import { ItemFormDialog } from "./components/item-form-dialog";
import { useGetItems } from "./hooks/use-get-items";
import { uploadItemCsvFile } from "./hooks/use-upload-item-csv";
import { ItemData } from "./types/item.types";

export function ItemsManagement() {
  const { profile, needsBankVerification, canViewPlatformFees } = useProfile();
  const queryClient = useQueryClient();
  const isStoreManager =
    profile?.role === "store_manager" ||
    profile?.roleCode === "STORE_MANAGER" ||
    profile?.role === "store_admin" ||
    profile?.roleCode === "STORE_ADMIN";
  const canWrite = !needsBankVerification;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingCsv, setIsUploadingCsv] = useState(false);
  const [csvFormatOpen, setCsvFormatOpen] = useState(false);
  const [csvResultOpen, setCsvResultOpen] = useState(false);
  const [csvResult, setCsvResult] = useState<CsvImportResult | null>(null);
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
  const [department, setDepartment] = useState("all");
  const [category, setCategory] = useState("all");

  const [appliedCountry, setAppliedCountry] = useState("all");
  const [appliedCity, setAppliedCity] = useState("all");
  const [appliedDepartment, setAppliedDepartment] = useState("all");
  const [appliedCategory, setAppliedCategory] = useState("all");

  const applyAllFilters = () => {
    applyFilters();
    setAppliedCountry(country);
    setAppliedCity(city);
    setAppliedDepartment(department);
    setAppliedCategory(category);
  };

  const cancelAllFilters = () => {
    cancelFilters();
    setCountry(appliedCountry);
    setCity(appliedCity);
    setDepartment(appliedDepartment);
    setCategory(appliedCategory);
  };
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemData | null>(null);
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
    departmentId: appliedDepartment !== "all" ? appliedDepartment : undefined,
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
    appliedDepartment !== "all" ||
    appliedCategory !== "all" ||
    debouncedSearch
  );

  const clearFilters = () => {
    resetBaseFilters();
    setCountry("all");
    setCity("all");
    setDepartment("all");
    setCategory("all");
    setAppliedCountry("all");
    setAppliedCity("all");
    setAppliedDepartment("all");
    setAppliedCategory("all");
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (applied.fromDate || applied.toDate) count++;
    if (appliedCountry !== "all" && appliedCountry !== "All") count++;
    if (appliedCity !== "all" && appliedCity !== "All") count++;
    if (appliedDepartment !== "all") count++;
    if (appliedCategory !== "all") count++;
    return count;
  }, [
    applied.fromDate,
    applied.toDate,
    appliedCountry,
    appliedCity,
    appliedDepartment,
    appliedCategory,
  ]);

  const handleEdit = useCallback((item: ItemData) => {
    setEditingItem(item);
    setDialogOpen(true);
  }, []);

  const handleViewDetails = useCallback(
    (item: ItemData) => {
      router.push(`${ROUTES.ADMIN.CATALOGUE_MANAGEMENT.ITEMS}/${item.id}`);
    },
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
    const qty = row.original.stockQuantity;
    if (qty === null || qty === undefined) return undefined;
    if (qty <= 0) {
      return "bg-rose-50/30 hover:bg-rose-50/60! dark:bg-rose-950/10 dark:hover:bg-rose-950/25!";
    }
    if (qty <= 5) {
      return "bg-amber-50/30 hover:bg-amber-50/60! dark:bg-amber-950/10 dark:hover:bg-amber-950/25!";
    }
    return undefined;
  }, []);

  const handleDownloadCsv = async () => {
    try {
      const response = await apiClient.get(CATALOGUE_MANAGEMENT_ENDPOINTS.DOWNLOAD_ITEM_CSV, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "item_import_template.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      // Axios interceptor will handle the error toast
    }
  };

  const showCsvResult = (result: CsvImportResult) => {
    setCsvResult(result);
    setCsvResultOpen(true);
  };

  const handleCsvFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv") && !file.name.toLowerCase().match(/\.xlsx?$/)) {
      errorToast({
        description: "Please upload a .csv or Excel file.",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploadingCsv(true);
    try {
      const res = await uploadItemCsvFile(file);
      const data = res?.data;
      const errors = data?.errors || [];
      const successCount = data?.successCount ?? 0;
      const errorCount = data?.errorCount ?? errors.length;

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.ITEMS }),
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.DEPARTMENTS }),
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.CATEGORIES }),
      ]);

      showCsvResult({
        title: errorCount > 0 ? "Import completed with errors." : "Import completed successfully.",
        description: res?.message,
        successCount,
        errorCount,
        departmentsCreated: data?.departmentsCreated ?? 0,
        categoriesCreated: data?.categoriesCreated ?? 0,
        errors,
        isError: errorCount > 0 && successCount === 0,
      });
    } catch (err) {
      const axiosError = err as AxiosError<{
        message?: string | string[];
        errors?: string[];
        data?: {
          successCount?: number;
          errorCount?: number;
          departmentsCreated?: number;
          categoriesCreated?: number;
          errors?: string[];
        };
      }>;
      const payload = axiosError.response?.data;
      const errors =
        payload?.errors ||
        payload?.data?.errors ||
        (Array.isArray(payload?.message)
          ? payload.message
          : payload?.message
            ? [String(payload.message)]
            : ["CSV import failed. Please check your file and try again."]);

      showCsvResult({
        title: "CSV import failed validation.",
        description: Array.isArray(payload?.message)
          ? payload.message[0]
          : typeof payload?.message === "string"
            ? payload.message
            : "Please fix the listed rows and upload again.",
        successCount: payload?.data?.successCount ?? 0,
        errorCount: payload?.data?.errorCount ?? errors.length,
        departmentsCreated: payload?.data?.departmentsCreated ?? 0,
        categoriesCreated: payload?.data?.categoriesCreated ?? 0,
        errors,
        isError: true,
      });
    } finally {
      setIsUploadingCsv(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-6">
      <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        ref={fileInputRef}
        onChange={handleCsvFileChange}
      />
      <CsvFormatHelpDialog
        open={csvFormatOpen}
        onOpenChange={setCsvFormatOpen}
        onDownloadTemplate={handleDownloadCsv}
      />
      <CsvImportResultDialog
        open={csvResultOpen}
        onOpenChange={setCsvResultOpen}
        result={csvResult}
      />

      <PageHeader
        title="Items"
        description="Manage all catalogue items across categories, departments, and countries."
        action={
          canWrite ? (
            <div className="flex flex-wrap items-center gap-2">
              {isStoreManager && (
                <>
                  <Button
                    onClick={() => setCsvFormatOpen(true)}
                    variant="outline"
                    className="gap-2 rounded-xl"
                  >
                    <Download className="h-4 w-4" />
                    Format
                  </Button>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="gap-2 rounded-xl"
                    disabled={isUploadingCsv}
                  >
                    <Upload className="h-4 w-4" />
                    {isUploadingCsv ? "Importing..." : "Import CSV"}
                  </Button>
                  <Button
                    onClick={() =>
                      router.push(`${ROUTES.ADMIN.CATALOGUE_MANAGEMENT.ITEMS}/upload-images`)
                    }
                    variant="outline"
                    className="gap-2 rounded-xl"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Upload Images
                  </Button>
                </>
              )}
              <Button
                onClick={() => {
                  setEditingItem(null);
                  setDialogOpen(true);
                }}
                className="gap-2 rounded-xl"
              >
                <Plus className="h-4 w-4" />
                Add Item
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
        description="Refine items by date, country, city, department, category, and status"
        countryId={isStoreManager ? undefined : country}
        onCountryChange={
          isStoreManager
            ? undefined
            : (val) => {
                setCountry(val);
                setDepartment("all");
                setCategory("all");
              }
        }
        cityId={isStoreManager ? undefined : city}
        onCityChange={
          isStoreManager
            ? undefined
            : (val) => {
                setCity(val);
                setDepartment("all");
                setCategory("all");
              }
        }
        hasFilters={hasFilters}
        onClearFilters={clearFilters}
        onApplyFilters={applyAllFilters}
        onCancelFilters={cancelAllFilters}
        activeFilterCount={activeFilterCount}
      >
        <>
          <div className="min-w-36 flex-1 space-y-1 sm:min-w-44">
            <Label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Department
            </Label>
            <DepartmentSelect
              countryId={country !== "all" ? country : undefined}
              value={department === "all" ? "" : department}
              onValueChange={(val) => {
                setDepartment(val || "all");
                setCategory("all");
              }}
              placeholder="All Departments"
              disabled={country === "all" && !isStoreManager}
              className="h-10 rounded-xl px-3"
            />
          </div>

          <div className="min-w-36 flex-1 space-y-1 sm:min-w-44">
            <Label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Category
            </Label>
            <CategorySelect
              departmentId={department !== "all" ? department : undefined}
              value={category === "all" ? "" : category}
              onValueChange={(val) => setCategory(val || "all")}
              placeholder="All Categories"
              disabled={department === "all"}
              className="h-10 rounded-xl px-3"
            />
          </div>
        </>
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
                  {filteredData.length} items found
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
            searchValue={search}
            onSearchChange={setSearch}
            loading={isLoading}
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            rowsPerPage={pagination.limit}
            onPageChange={(p) => setPage(p)}
            onRowsPerPageChange={(l) => setLimit(l)}
            getRowClassName={getRowClassName}
          />
        </CardContent>
      </Card>

      <ItemFormDialog open={dialogOpen} onOpenChange={setDialogOpen} item={editingItem} />
    </div>
  );
}
