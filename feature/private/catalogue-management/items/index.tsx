"use client";

import { Filter, Package, Plus, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

import { CATALOGUE_STATUS_OPTIONS, ITEM_STAT_CONFIG } from "@/constants/catalogue-management";
import { ItemData } from "./types/item.types";
import { useGetItems } from "./hooks/use-get-items";

import { getItemColumns } from "./columns/item-columns";
import { ItemFormDialog } from "./components/item-form-dialog";

import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
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
import { CountrySelect } from "@/components/common/country-select";
import { DepartmentSelect } from "@/components/common/department-select";
import { CategorySelect } from "@/components/common/category-select";

export function ItemsManagement() {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [status, setStatus] = useState("all");
  const [country, setCountry] = useState("all");
  const [department, setDepartment] = useState("all");
  const [category, setCategory] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemData | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { data: itemsResponse, isLoading } = useGetItems({
    page,
    limit,
    search,
    countryId: country !== "all" ? country : undefined,
    departmentId: department !== "all" ? department : undefined,
    categoryId: category !== "all" ? category : undefined,
    status: status !== "all" ? status : undefined,
    fromDate: fromDate?.toISOString().split("T")[0],
    toDate: toDate?.toISOString().split("T")[0],
  });

  const filteredData = itemsResponse?.data || [];
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
    department !== "all" ||
    category !== "all"
  );

  const clearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setStatus("all");
    setCountry("all");
    setDepartment("all");
    setCategory("all");
  };

  const handleEdit = (item: ItemData) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleView = (_item: ItemData) => {};

  const columns = useMemo(
    () => getItemColumns(handleEdit, handleView),

    [],
  );

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
            trendLabel="Compared to last month"
            trendValue="+10%"
            icon={Icon}
            iconClassName={color}
            iconWrapperClassName={bg}
          />
        ))}
      </div>

      <Card className="relative overflow-hidden rounded-2xl border border-slate-200/80">
        <div className="from-primary/10 via-primary to-primary/10 absolute inset-x-0 top-0 h-0.5 bg-gray-100" />

        <CardHeader className="border-b border-slate-100 px-5 py-4 sm:px-6 dark:border-slate-800">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary ring-primary/10 flex h-10 w-10 items-center justify-center rounded-xl ring-1">
                <Filter className="h-4.5 w-4.5" />
              </div>

              <div>
                <CardTitle className="text-base font-bold tracking-tight text-slate-900 sm:text-lg dark:text-white">
                  Filter Items
                </CardTitle>

                <p className="mt-0.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                  Refine items by date, department, category, country and status
                </p>
              </div>
            </div>

            {hasFilters && (
              <div className="border-primary/15 bg-primary/5 hidden items-center gap-2 rounded-full border px-3 py-1.5 sm:flex">
                <span className="bg-primary h-1.5 w-1.5 rounded-full" />

                <span className="text-primary text-[11px] font-semibold">Filters applied</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5">
          <div className="rounded-xl border border-slate-200/70 bg-slate-50/60 p-3.5 sm:p-4 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sm:col-span-2">
                <DateRangeFilter
                  fromDate={fromDate}
                  toDate={toDate}
                  onFromDateChange={setFromDate}
                  onToDateChange={setToDate}
                  wrapperClassName="flex flex-col sm:flex-row gap-3"
                  itemClassName="flex-1 min-w-0 space-y-1.5"
                  pickerClassName="h-10 w-full rounded-lg border-slate-200 bg-white shadow-none dark:border-slate-700 dark:bg-slate-950"
                  labelClassName="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Country
                </Label>

                <CountrySelect
                  value={country === "all" ? "" : country}
                  onValueChange={(val) => {
                    setCountry(val || "all");
                    setDepartment("all");
                    setCategory("all");
                  }}
                  valueKey="id"
                  includeAll
                  allLabel="All Countries"
                  className="h-10 rounded-lg px-3"
                />
              </div>

              <div className="space-y-1.5">
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
                  className="h-10 rounded-lg px-3"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Category
                </Label>

                <CategorySelect
                  departmentId={department !== "all" ? department : undefined}
                  value={category === "all" ? "" : category}
                  onValueChange={(val) => setCategory(val || "all")}
                  placeholder="All Categories"
                  disabled={department === "all"}
                  className="h-10 rounded-lg px-3"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Status
                </Label>

                <Select value={status} onValueChange={(v) => setStatus(v ?? "all")}>
                  <SelectTrigger className="h-10 w-full rounded-lg border-slate-200 bg-white px-3 text-sm font-medium shadow-none dark:border-slate-700 dark:bg-slate-950">
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

              <div className="flex items-end sm:col-span-2 lg:col-span-4">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  disabled={!hasFilters}
                  className="h-10 w-full rounded-lg border-slate-200 bg-white font-semibold text-slate-600 shadow-none transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
                >
                  <RotateCcw className="mr-2 h-3.5 w-3.5" />
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="relative overflow-hidden rounded-2xl border border-slate-200/80">
        <div className="from-primary/10 via-primary to-primary/10 absolute inset-x-0 top-0 h-0.5 bg-gray-100" />

        <CardHeader className="border-b border-slate-100 px-5 py-5 sm:px-6 dark:border-slate-800">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
              <div className="bg-primary/10 text-primary ring-primary/10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1">
                <Package className="h-5.25 w-5.25" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-white">
                    All Items
                  </CardTitle>

                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:bg-slate-800 dark:text-slate-400">
                    Catalogue
                  </span>
                </div>

                <p className="mt-1 text-xs font-medium text-slate-400 sm:text-sm dark:text-slate-500">
                  Browse, search, and manage all catalogue items
                </p>
              </div>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-slate-800">
                <Package className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              </div>

              <div className="leading-none">
                <p className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                  Results
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                  {filteredData.length}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-4 py-3 sm:px-5 dark:border-slate-800 dark:bg-slate-900/30">
            <div className="flex items-center gap-2">
              <span className="bg-primary h-1.5 w-1.5 rounded-full" />

              <span className="text-[10px] font-bold tracking-[0.14em] text-slate-400 uppercase">
                Item Directory
              </span>
            </div>

            <span className="hidden text-[11px] font-medium text-slate-400 sm:block">
              Search & manage items
            </span>
          </div>

          <div className="px-3 pt-2 pb-4 sm:px-4">
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
          </div>
        </CardContent>
      </Card>

      <ItemFormDialog open={dialogOpen} onOpenChange={setDialogOpen} item={editingItem} />
    </div>
  );
}
