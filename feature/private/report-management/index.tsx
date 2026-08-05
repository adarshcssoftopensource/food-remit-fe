"use client";

import { FileSpreadsheet, Globe, MapPin, TableProperties, UtensilsCrossed } from "lucide-react";
import { useState } from "react";

import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
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
import {
  REPORT_CITY_OPTIONS,
  REPORT_COUNTRY_OPTIONS,
  REPORT_FOOD_TYPE_OPTIONS,
  REPORT_SECTION_META,
  type CouponReportRow,
  type CustomerReportRow,
  type OrderReportRow,
  type ReportSectionKey,
} from "@/constants/report-management";
import {
  couponReportColumns,
  customerReportColumns,
  orderReportColumns,
} from "./columns/other-report-columns";
import { storeReportColumns } from "./columns/store-report-columns";
import { ReportDateFilters } from "./components/report-date-filters";
import { useReportDateFilters } from "./hooks/use-report-date-filters";
import { useStoreReport } from "./hooks/use-store-report";

type ReportManagementPageProps = {
  section: ReportSectionKey;
};

function ExportButton() {
  return (
    <Button className="h-10 gap-2 rounded-lg px-4">
      <FileSpreadsheet className="h-4 w-4" />
      Export Excel
    </Button>
  );
}

function EmptyReportsTable({ section }: { section: Exclude<ReportSectionKey, "store-report"> }) {
  const meta = REPORT_SECTION_META[section];
  const { applyFilters, clearFilters, fromDate, hasFilters, setFromDate, setToDate, toDate } =
    useReportDateFilters();
  const [foodType, setFoodType] = useState("All");

  const clearAll = () => {
    clearFilters();
    setFoodType("All");
  };

  const table =
    section === "customer-report" ? (
      <DataTable
        columns={customerReportColumns}
        data={[] as CustomerReportRow[]}
        searchKey={meta.searchKey}
      />
    ) : section === "orders-report" ? (
      <DataTable
        columns={orderReportColumns}
        data={[] as OrderReportRow[]}
        searchKey={meta.searchKey}
      />
    ) : (
      <DataTable
        columns={couponReportColumns}
        data={[] as CouponReportRow[]}
        searchKey={meta.searchKey}
      />
    );

  return (
    <div className="space-y-6">
      <PageHeader title="Report Management" description={meta.description} />

      <ReportDateFilters
        fromDate={fromDate}
        toDate={toDate}
        hasFilters={hasFilters || (section === "orders-report" && foodType !== "All")}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onApply={applyFilters}
        onClear={clearAll}
      />

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="space-y-6 border-b pb-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                <TableProperties className="text-primary h-5 w-5" />
              </div>

              <div>
                <CardTitle className="text-xl font-semibold">{meta.title}</CardTitle>

                <p className="text-muted-foreground text-sm">0 entries found</p>
              </div>
            </div>

            <ExportButton />
          </div>

          {section === "orders-report" && (
            <div className="bg-muted/40 rounded-xl border p-4">
              <div className="max-w-sm space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wide uppercase">
                  <UtensilsCrossed className="h-4 w-4" />
                  Food Type
                </Label>

                <Select value={foodType} onValueChange={(v) => setFoodType(v ?? "All")}>
                  <SelectTrigger className="h-10! w-full rounded-lg">
                    <SelectValue placeholder="Select Food Type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {REPORT_FOOD_TYPE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>{table}</CardContent>
      </Card>
    </div>
  );
}

function StoreReportsPage() {
  const meta = REPORT_SECTION_META["store-report"];
  const {
    applyFilters,
    city,
    clearFilters,
    country,
    filteredData,
    fromDate,
    hasFilters,
    setCity,
    setCountry,
    setFromDate,
    setToDate,
    toDate,
  } = useStoreReport();

  return (
    <div className="space-y-6">
      <PageHeader title="Report Management" description={meta.description} />

      <ReportDateFilters
        fromDate={fromDate}
        toDate={toDate}
        hasFilters={hasFilters}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onApply={applyFilters}
        onClear={clearFilters}
      />

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="space-y-6 border-b pb-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                  <TableProperties className="text-primary h-5 w-5" />
                </div>

                <div>
                  <CardTitle className="text-xl font-semibold">{meta.title}</CardTitle>

                  <p className="text-muted-foreground text-sm">
                    {filteredData.length} entr
                    {filteredData.length !== 1 ? "ies" : "y"} found
                  </p>
                </div>
              </div>
            </div>

            <ExportButton />
          </div>

          <div className="bg-muted/40 rounded-xl border p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wide uppercase">
                  <Globe className="h-4 w-4" />
                  Country
                </Label>

                <Select value={country} onValueChange={(v) => setCountry(v ?? "All")}>
                  <SelectTrigger className="h-10! w-full rounded-lg">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {REPORT_COUNTRY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wide uppercase">
                  <MapPin className="h-4 w-4" />
                  City
                </Label>

                <Select value={city} onValueChange={(v) => setCity(v ?? "All")}>
                  <SelectTrigger className="h-10! w-full rounded-lg">
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {REPORT_CITY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={storeReportColumns} data={filteredData} searchKey={meta.searchKey} />
        </CardContent>
      </Card>
    </div>
  );
}

export function ReportManagementPage({ section }: ReportManagementPageProps) {
  if (section === "store-report") {
    return <StoreReportsPage />;
  }

  return <EmptyReportsTable section={section} />;
}
