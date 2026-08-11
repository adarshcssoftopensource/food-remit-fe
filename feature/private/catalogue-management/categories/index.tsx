"use client";

import { Filter, Plus, RotateCcw, Tags } from "lucide-react";
import { useMemo, useState } from "react";

import {
  CATALOGUE_COUNTRY_OPTIONS,
  CATALOGUE_DEPARTMENT_OPTIONS,
  CATALOGUE_STATUS_OPTIONS,
  CATEGORY_STAT_CONFIG,
  CategoryData,
  MOCK_CATEGORIES,
} from "@/constants/catalogue-management";

import { getCategoryColumns } from "./columns/category-columns";
import { CategoryFormDialog } from "./components/category-form-dialog";

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

export function CategoriesManagement() {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [status, setStatus] = useState("all");
  const [country, setCountry] = useState("all");
  const [department, setDepartment] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<CategoryData | null>(null);

  const filteredData = useMemo<CategoryData[]>(
    () =>
      MOCK_CATEGORIES.filter((cat) => {
        if (status !== "all" && cat.status !== status) return false;
        if (country !== "all" && cat.country !== country) return false;
        if (department !== "all" && cat.departmentId !== department) return false;
        const date = new Date(cat.createdOn);
        if (fromDate && date < fromDate) return false;
        if (toDate && date > toDate) return false;
        return true;
      }),
    [status, country, department, fromDate, toDate],
  );

  const stats = {
    total: MOCK_CATEGORIES.length,
    active: MOCK_CATEGORIES.filter((c) => c.status === "Active").length,
    inactive: MOCK_CATEGORIES.filter((c) => c.status === "Inactive").length,
  };

  const hasFilters = !!(
    fromDate ||
    toDate ||
    status !== "all" ||
    country !== "all" ||
    department !== "all"
  );

  const clearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setStatus("all");
    setCountry("all");
    setDepartment("all");
  };

  const handleEdit = (cat: CategoryData) => {
    setEditingCat(cat);
    setDialogOpen(true);
  };

  const handleView = (_cat: CategoryData) => {};

  const columns = useMemo(
    () => getCategoryColumns(handleEdit, handleView),

    [],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Manage all catalogue categories and their associated departments."
        action={
          <Button
            onClick={() => {
              setEditingCat(null);
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
            trendLabel="Compared to last month"
            trendValue="+5%"
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
                  Filter Categories
                </CardTitle>

                <p className="mt-0.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                  Refine categories by date, department, country and status
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
          <div className="rounded-xl border border-slate-200/70 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
              <div className="min-w-0 flex-1 lg:min-w-75">
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

              <div className="w-full lg:w-47.5">
                <Label className="mb-1.5 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Department
                </Label>

                <Select value={department} onValueChange={(v) => setDepartment(v ?? "all")}>
                  <SelectTrigger className="h-10 w-full rounded-lg border-slate-200 bg-white px-3 text-sm font-medium shadow-none dark:border-slate-700 dark:bg-slate-950">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {CATALOGUE_DEPARTMENT_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full lg:w-41.25">
                <Label className="mb-1.5 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Country
                </Label>

                <Select value={country} onValueChange={(v) => setCountry(v ?? "all")}>
                  <SelectTrigger className="h-10 w-full rounded-lg border-slate-200 bg-white px-3 text-sm font-medium shadow-none dark:border-slate-700 dark:bg-slate-950">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {CATALOGUE_COUNTRY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full lg:w-41.25">
                <Label className="mb-1.5 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
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

              <Button
                variant="outline"
                onClick={clearFilters}
                disabled={!hasFilters}
                className="h-10 w-full shrink-0 rounded-lg border-slate-200 bg-white px-4 font-semibold text-slate-600 shadow-none hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 lg:w-auto dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                <RotateCcw className="mr-2 h-3.5 w-3.5" />
                Reset
              </Button>
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
                <Tags className="h-5.25 w-5.25" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-white">
                    All Categories
                  </CardTitle>

                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:bg-slate-800 dark:text-slate-400">
                    Catalogue
                  </span>
                </div>

                <p className="mt-1 text-xs font-medium text-slate-400 sm:text-sm dark:text-slate-500">
                  Browse, search, and manage all categories
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
                Category Directory
              </span>
            </div>

            <span className="hidden text-[11px] font-medium text-slate-400 sm:block">
              Search & manage categories
            </span>
          </div>

          <div className="px-3 pt-2 pb-4 sm:px-4">
            <DataTable columns={columns} data={filteredData} searchKey="name" />
          </div>
        </CardContent>
      </Card>

      <CategoryFormDialog open={dialogOpen} onOpenChange={setDialogOpen} category={editingCat} />
    </div>
  );
}
