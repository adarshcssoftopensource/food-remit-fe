"use client";

import { CategorySelect } from "@/components/common/category-select";
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
import { CATALOGUE_STATUS_OPTIONS, ITEM_STAT_CONFIG } from "@/constants/catalogue-management";
import { useTableFilters } from "@/hooks/use-table-filters";
import { Package, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { getItemColumns } from "./columns/item-columns";
import { ItemFormDialog } from "./components/item-form-dialog";
import { useGetItems } from "./hooks/use-get-items";
import { ItemData } from "./types/item.types";

export function ItemsManagement() {
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
    formattedFromDate,
    formattedToDate,
  } = useTableFilters();

  const router = useRouter();
  const [country, setCountry] = useState("all");
  const [city, setCity] = useState("all");
  const [department, setDepartment] = useState("all");
  const [category, setCategory] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemData | null>(null);

  const { data: itemsResponse, isLoading } = useGetItems({
    page,
    limit,
    search,
    countryId: country !== "all" ? country : undefined,
    departmentId: department !== "all" ? department : undefined,
    categoryId: category !== "all" ? category : undefined,
    status: status !== "all" ? status : undefined,
    fromDate: formattedFromDate,
    toDate: formattedToDate,
  });

  const filteredData = useMemo(() => {
    const rawFilteredData = itemsResponse?.data || [];
    return rawFilteredData.filter((item) => {
      if (
        city !== "all" &&
        city !== "All" &&
        (item as any).cityId &&
        (item as any).cityId !== city
      ) {
        return false;
      }
      return true;
    });
  }, [itemsResponse?.data, city]);

  const pagination = itemsResponse?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 };

  const stats = {
    total: itemsResponse?.stats?.total || 0,
    active: itemsResponse?.stats?.active || 0,
    inactive: itemsResponse?.stats?.inactive || 0,
  };

  const hasFilters = !!(
    fromDate ||
    toDate ||
    status !== "all" ||
    country !== "all" ||
    city !== "all" ||
    department !== "all" ||
    category !== "all" ||
    search
  );

  const clearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setStatus("all");
    setCountry("all");
    setCity("all");
    setDepartment("all");
    setCategory("all");
    setSearch("");
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (fromDate || toDate) count++;
    if (country !== "all" && country !== "All") count++;
    if (city !== "all" && city !== "All") count++;
    if (department !== "all") count++;
    if (category !== "all") count++;
    if (status !== "all") count++;
    return count;
  }, [fromDate, toDate, country, city, department, category, status]);

  const handleEdit = useCallback((item: ItemData) => {
    setEditingItem(item);
    setDialogOpen(true);
  }, []);

  const handleView = useCallback(
    (item: ItemData) => {
      router.push(`${ROUTES.ADMIN.CATALOGUE_MANAGEMENT.ITEMS}/${item.id}`);
    },
    [router],
  );

  const columns = useMemo(() => getItemColumns(handleEdit, handleView), [handleEdit, handleView]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Items"
        description="Manage all catalogue items across categories, departments, and countries."
        action={
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
        countryId={country}
        onCountryChange={(val) => {
          setCountry(val);
          setDepartment("all");
          setCategory("all");
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
            onValueChange={(val) => {
              setDepartment(val || "all");
              setCategory("all");
            }}
            placeholder="All Departments"
            disabled={country === "all"}
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
