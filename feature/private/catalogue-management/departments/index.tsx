"use client";

import { Filter, Plus, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

import {
  CATALOGUE_COUNTRY_OPTIONS,
  CATALOGUE_STATUS_OPTIONS,
  DEPARTMENT_STAT_CONFIG,
  DepartmentData,
  MOCK_DEPARTMENTS,
} from "@/constants/catalogue-management";

import { getDepartmentColumns } from "./columns/department-columns";
import { DepartmentFormDialog } from "./components/department-form-dialog";

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

export function DepartmentsManagement() {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [status, setStatus] = useState("all");
  const [country, setCountry] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<DepartmentData | null>(null);

  const filteredData = useMemo<DepartmentData[]>(
    () =>
      MOCK_DEPARTMENTS.filter((dept) => {
        if (status !== "all" && dept.status !== status) return false;
        if (country !== "all" && dept.country !== country) return false;
        const date = new Date(dept.createdOn);
        if (fromDate && date < fromDate) return false;
        if (toDate && date > toDate) return false;
        return true;
      }),
    [status, country, fromDate, toDate],
  );

  const stats = {
    total: MOCK_DEPARTMENTS.length,
    active: MOCK_DEPARTMENTS.filter((d) => d.status === "Active").length,
    inactive: MOCK_DEPARTMENTS.filter((d) => d.status === "Inactive").length,
  };

  const hasFilters = !!(fromDate || toDate || status !== "all" || country !== "all");

  const clearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setStatus("all");
    setCountry("all");
  };

  const handleEdit = (dept: DepartmentData) => {
    setEditingDept(dept);
    setDialogOpen(true);
  };

  const handleView = (_dept: DepartmentData) => {};

  const columns = useMemo(
    () => getDepartmentColumns(handleEdit, handleView),

    [],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Departments"
        description="Manage all catalogue departments across countries and stores."
        action={
          <Button
            onClick={() => {
              setEditingDept(null);
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
            trendLabel="Compared to last month"
            trendValue="+8%"
            icon={Icon}
            iconClassName={color}
            iconWrapperClassName={bg}
          />
        ))}
      </div>

      <Card className="rounded-xl border bg-white shadow-sm">
        <CardHeader className="border-b py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
              <Filter className="text-primary h-4 w-4" />
            </div>
            <CardTitle className="text-lg font-semibold">Filter Departments</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end lg:flex-nowrap">
            <DateRangeFilter
              fromDate={fromDate}
              toDate={toDate}
              onFromDateChange={setFromDate}
              onToDateChange={setToDate}
              wrapperClassName="flex flex-col sm:flex-row flex-1 gap-3"
              itemClassName="flex-1 space-y-1 min-w-0"
              pickerClassName="h-10 w-full"
              labelClassName="text-muted-foreground text-xs font-medium uppercase"
            />

            <div className="min-w-0 flex-1 sm:min-w-40">
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

            <div className="min-w-0 flex-1 sm:min-w-40">
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

            <Button
              variant="destructive"
              onClick={clearFilters}
              disabled={!hasFilters}
              className="h-10 w-full shrink-0 px-5 sm:w-auto"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="border-b px-6 py-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Departments</CardTitle>

              <p className="text-muted-foreground mt-1 text-sm">
                View, search, and manage all departments.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <DataTable columns={columns} data={filteredData} searchKey="name" />
        </CardContent>
      </Card>

      <DepartmentFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        department={editingDept}
      />
    </div>
  );
}
