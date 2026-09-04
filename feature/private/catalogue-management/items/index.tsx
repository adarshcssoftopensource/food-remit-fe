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
import { successToast } from "@/components/toaster";
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
import { CATALOGUE_STATUS_OPTIONS, ITEM_STAT_CONFIG } from "@/constants/catalogue-management";
import { useDraftTableFilters } from "@/hooks/use-table-filters";
import apiClient from "@/lib/api/client";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { Download, Image as ImageIcon, Package, Plus, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { getItemColumns } from "./columns/item-columns";
import { ItemFormDialog } from "./components/item-form-dialog";
import { useGetItems } from "./hooks/use-get-items";
import { useUploadItemCsv } from "./hooks/use-upload-item-csv";
import { ItemData } from "./types/item.types";

export function ItemsManagement() {
  const { profile } = useProfile();
  const isStoreManager =
    profile?.role === "store_manager" ||
    profile?.roleCode === "STORE_MANAGER" ||
    profile?.role === "store_admin" ||
    profile?.roleCode === "STORE_ADMIN";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadCsvMutation = useUploadItemCsv();
  const {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    status,
    setStatus,
    page,
    setPage,
    limit,
    setLimit,
    searchQuery: search,
    setSearchQuery: setSearch,
    debouncedSearch,
    formattedToDate,
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
  const { data: itemsResponse, isLoading } = useGetItems({
    page,
    limit,
    search: debouncedSearch,
    countryId: appliedCountry !== "all" ? appliedCountry : undefined,
    cityId: appliedCity !== "all" ? appliedCity : undefined,
    departmentId: appliedDepartment !== "all" ? appliedDepartment : undefined,
    categoryId: appliedCategory !== "all" ? appliedCategory : undefined,
    status: applied.status !== "all" ? applied.status : undefined,
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
    applied.status !== "all" ||
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
    if (applied.status !== "all") count++;
    return count;
  }, [
    applied.fromDate,
    applied.toDate,
    appliedCountry,
    appliedCity,
    appliedDepartment,
    appliedCategory,
    applied.status,
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
    () => getItemColumns(handleEdit, handleViewDetails, handleImageClick, isStoreScoped),
    [handleEdit, handleViewDetails, handleImageClick, isStoreScoped],
  );

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
    } catch (error) {
      // Axios interceptor will handle the error toast
    }
  };

  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    uploadCsvMutation.mutate(formData, {
      onSuccess: () => {
        successToast({ description: "CSV uploaded successfully" });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
      onError: () => {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      <input
        type="file"
        accept=".csv"
        className="hidden"
        ref={fileInputRef}
        onChange={handleCsvFileChange}
      />

      <PageHeader
        title="Items"
        description="Manage all catalogue items across categories, departments, and countries."
        action={
          <div className="flex flex-wrap items-center gap-2">
            {isStoreManager && (
              <>
                <Button onClick={handleDownloadCsv} variant="outline" className="gap-2 rounded-xl">
                  <Download className="h-4 w-4" />
                  Format
                </Button>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="gap-2 rounded-xl"
                  disabled={uploadCsvMutation.isPending}
                >
                  <Upload className="h-4 w-4" />
                  Import CSV
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
          />
        </CardContent>
      </Card>

      <ItemFormDialog open={dialogOpen} onOpenChange={setDialogOpen} item={editingItem} />
    </div>
  );
}
