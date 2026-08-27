"use client";

import { FileSpreadsheet, TableProperties } from "lucide-react";
import { useFilterState } from "@/hooks/use-filter-state";

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
    <Button className="h-10 gap-2 rounded-xl px-4 font-semibold">
      <FileSpreadsheet className="h-4 w-4" />
      Export Excel
    </Button>
  );
}

function EmptyReportsTable({ section }: { section: Exclude<ReportSectionKey, "store-report"> }) {
  const meta = REPORT_SECTION_META[section];
  const {
    applyFilters,
    cancelFilters,
    clearFilters,
    fromDate,
    hasFilters,
    setFromDate,
    setToDate,
    toDate,
  } = useReportDateFilters();
  const { draft, setDraft, applied, apply, cancel, reset } = useFilterState({
    foodType: "All",
    country: "all",
    city: "all",
  });

  const clearAll = () => {
    clearFilters();
    reset();
  };

  const handleApply = () => {
    applyFilters();
    apply();
  };

  const handleCancel = () => {
    cancelFilters();
    cancel();
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
        countryId={draft.country}
        cityId={draft.city}
        onCountryChange={(v) => setDraft((p) => ({ ...p, country: v }))}
        onCityChange={(v) => setDraft((p) => ({ ...p, city: v }))}
        hasFilters={
          hasFilters ||
          (section === "orders-report" && applied.foodType !== "All") ||
          applied.country !== "all" ||
          applied.city !== "all"
        }
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onApply={handleApply}
        onCancel={handleCancel}
        onClear={clearAll}
      >
        {section === "orders-report" && (
          <div className="min-w-36 flex-1 space-y-1 sm:min-w-44">
            <Label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Food Type
            </Label>
            <Select
              value={draft.foodType}
              onValueChange={(v) => setDraft((p) => ({ ...p, foodType: v ?? "All" }))}
            >
              <SelectTrigger className="h-10 w-full rounded-xl border-slate-200/80 bg-white px-3 text-sm font-medium dark:border-slate-800 dark:bg-slate-900">
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
        )}
      </ReportDateFilters>

      <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary ring-primary/20 flex size-10 items-center justify-center rounded-xl ring-1">
              <TableProperties className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                {meta.title}
              </CardTitle>
              <p className="text-muted-foreground text-xs">0 entries found</p>
            </div>
          </div>

          <ExportButton />
        </CardHeader>
        <CardContent className="p-4">{table}</CardContent>
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
    cancelFilters,
  } = useStoreReport();

  return (
    <div className="space-y-6">
      <PageHeader title="Report Management" description={meta.description} />

      <ReportDateFilters
        fromDate={fromDate}
        toDate={toDate}
        countryId={country === "All" ? "all" : country}
        cityId={city === "All" ? "all" : city}
        hasFilters={hasFilters}
        onCountryChange={(v) => setCountry(v === "all" ? "All" : v)}
        onCityChange={(v) => setCity(v === "all" ? "All" : v)}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onApply={applyFilters}
        onCancel={cancelFilters}
        onClear={clearFilters}
      />

      <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary ring-primary/20 flex size-10 items-center justify-center rounded-xl ring-1">
              <TableProperties className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                {meta.title}
              </CardTitle>
              <p className="text-muted-foreground text-xs">
                {filteredData.length} entr
                {filteredData.length !== 1 ? "ies" : "y"} found
              </p>
            </div>
          </div>

          <ExportButton />
        </CardHeader>
        <CardContent className="p-4">
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
