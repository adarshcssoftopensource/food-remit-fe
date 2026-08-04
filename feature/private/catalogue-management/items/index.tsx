"use client";

import { Filter, Plus, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

import {
  CATALOGUE_CATEGORY_OPTIONS,
  CATALOGUE_COUNTRY_OPTIONS,
  CATALOGUE_DEPARTMENT_OPTIONS,
  CATALOGUE_STATUS_OPTIONS,
  ITEM_STAT_CONFIG,
  ItemData,
  MOCK_ITEMS,
} from "@/constants/catalogue-management";

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

export function ItemsManagement() {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [status, setStatus] = useState("all");
  const [country, setCountry] = useState("all");
  const [department, setDepartment] = useState("all");
  const [category, setCategory] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemData | null>(null);

  const filteredData = useMemo<ItemData[]>(
    () =>
      MOCK_ITEMS.filter((item) => {
        if (status !== "all" && item.status !== status) return false;
        if (country !== "all" && item.country !== country) return false;
        if (department !== "all" && item.departmentId !== department) return false;
        if (category !== "all" && item.categoryId !== category) return false;
        const date = new Date(item.createdOn);
        if (fromDate && date < fromDate) return false;
        if (toDate && date > toDate) return false;
        return true;
      }),
    [status, country, department, category, fromDate, toDate],
  );

  const stats = {
    total: MOCK_ITEMS.length,
    active: MOCK_ITEMS.filter((i) => i.status === "Active").length,
    inactive: MOCK_ITEMS.filter((i) => i.status === "Inactive").length,
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

      {/* Stat Cards */}
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

      {/* Filter Card */}
      <Card className="rounded-xl border bg-white shadow-sm">
        <CardHeader className="border-b py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
              <Filter className="text-primary h-4 w-4" />
            </div>
            <CardTitle className="text-lg font-semibold">Filter Items</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <DateRangeFilter
              fromDate={fromDate}
              toDate={toDate}
              onFromDateChange={setFromDate}
              onToDateChange={setToDate}
              wrapperClassName="contents"
              itemClassName="space-y-1 min-w-0"
              pickerClassName="h-10 w-full"
              labelClassName="text-muted-foreground text-xs font-medium uppercase"
            />

            {/* Department */}
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs font-medium uppercase">
                Department
              </Label>
              <Select value={department} onValueChange={(v) => setDepartment(v ?? "all")}>
                <SelectTrigger className="h-10! w-full">
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

            {/* Category */}
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs font-medium uppercase">
                Category
              </Label>
              <Select value={category} onValueChange={(v) => setCategory(v ?? "all")}>
                <SelectTrigger className="h-10! w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {CATALOGUE_CATEGORY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Country */}
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs font-medium uppercase">Country</Label>
              <Select value={country} onValueChange={(v) => setCountry(v ?? "all")}>
                <SelectTrigger className="h-10! w-full">
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

            {/* Status */}
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs font-medium uppercase">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v ?? "all")}>
                <SelectTrigger className="h-10! w-full">
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

            {/* Reset */}
            <div className="flex items-end">
              <Button
                variant="destructive"
                onClick={clearFilters}
                disabled={!hasFilters}
                className="h-10 w-full rounded-lg"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b py-2">
          <div>
            <CardTitle className="text-xl font-semibold">All Items</CardTitle>
            <p className="text-muted-foreground mt-1 text-sm">
              {filteredData.length} item{filteredData.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <DataTable columns={columns} data={filteredData} searchKey="name" />
        </CardContent>
      </Card>

      <ItemFormDialog open={dialogOpen} onOpenChange={setDialogOpen} item={editingItem} />
    </div>
  );
}
