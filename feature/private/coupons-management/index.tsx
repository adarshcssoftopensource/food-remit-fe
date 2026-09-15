"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Gift, Plus, RotateCcw, Search, Sparkles, Ticket, TrendingUp } from "lucide-react";
import Link from "next/link";

import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { PageHeader } from "@/components/common/page-header";
import { MetricStatCard } from "@/components/common/stats/metric-stat-card";
import { useProfile } from "@/components/providers/profile-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterState } from "@/hooks/use-filter-state";
import { useDebounce } from "@/lib/debounce";
import { StoreSelect } from "@/components/common/store-select";
import { couponColumns } from "./columns/coupon-columns";
import { useGetCoupons } from "./hooks/use-get-coupons";
import { Button } from "@/components/ui/button";
import { SortingState } from "@tanstack/react-table";
import { ROUTES } from "@/config/routes";

const statusOptions = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Expired", value: "expired" },
  { label: "Scheduled", value: "scheduled" },
];

export function CouponsManagement() {
  const { isSuperAdmin } = useProfile();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  const { draft, setDraft, applied, apply, cancel, reset } = useFilterState({
    fromDate: undefined as Date | undefined,
    toDate: undefined as Date | undefined,
    statusFilter: "all",
    storeId: "all",
    country: "all",
    city: "all",
  });

  const sortBy = sorting.length > 0 ? sorting[0].id : undefined;
  const sortOrder: "asc" | "desc" | undefined =
    sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined;

  const queryParams = useMemo(() => {
    return {
      page,
      limit,
      search: debouncedSearch.trim() || undefined,
      sortBy,
      sortOrder,
      status: applied.statusFilter !== "all" ? applied.statusFilter : undefined,
      storeId: applied.storeId !== "all" ? applied.storeId : undefined,
      fromDate: applied.fromDate ? format(applied.fromDate, "yyyy-MM-dd") : undefined,
      toDate: applied.toDate ? format(applied.toDate, "yyyy-MM-dd") : undefined,
    };
  }, [page, limit, debouncedSearch, sortBy, sortOrder, applied]);

  const { data, isLoading, isFetching, refetch } = useGetCoupons(queryParams);

  const coupons = data?.data || [];
  const pagination = data?.pagination || {
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 1,
  };
  const stats = data?.stats || {
    totalCoupons: 0,
    activeCount: 0,
    inactiveCount: 0,
    redeemedCoupons: 0,
  };

  const hasFilters = Boolean(
    applied.fromDate ||
    applied.toDate ||
    applied.statusFilter !== "all" ||
    (applied.storeId && applied.storeId !== "all"),
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (applied.fromDate || applied.toDate) count++;
    if (applied.statusFilter !== "all") count++;
    if (applied.storeId && applied.storeId !== "all") count++;
    return count;
  }, [applied]);

  const handleClearFilters = () => {
    reset();
    setPage(1);
  };

  const metricCards = [
    {
      label: "Total Coupons",
      value: stats.totalCoupons,
      trendLabel: "All Campaigns",
      trendValue: "Total",
      icon: Sparkles,
      iconClassName: "text-amber-600",
      iconWrapperClassName: "bg-amber-100 dark:bg-amber-950/40",
    },
    {
      label: "Active Coupons",
      value: stats.activeCount,
      trendLabel: "Currently Applicable",
      trendValue: "Live",
      icon: Gift,
      iconClassName: "text-emerald-600",
      iconWrapperClassName: "bg-emerald-100 dark:bg-emerald-950/40",
    },
    {
      label: "Inactive / Expired",
      value: stats.inactiveCount,
      trendLabel: "Paused / Ended",
      trendValue: "Ended",
      icon: RotateCcw,
      iconClassName: "text-slate-700 dark:text-slate-300",
      iconWrapperClassName: "bg-slate-100 dark:bg-slate-800",
    },
    {
      label: "Redeemed Coupons",
      value: stats.redeemedCoupons,
      trendLabel: "Total Customer Uses",
      trendValue: "Redeemed",
      icon: TrendingUp,
      iconClassName: "text-blue-600",
      iconWrapperClassName: "bg-blue-100 dark:bg-blue-950/40",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coupons Management"
        description="Create and manage global and store-specific promotional discount coupons with date/time scheduling."
        action={
          <Button
            asChild
            className="h-10 cursor-pointer rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-4 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-700"
          >
            <Link
              href={ROUTES.ADMIN.COUPONS_MANAGEMENT.CREATE}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="size-4 shrink-0" />
              <span>Create Coupon</span>
            </Link>
          </Button>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => (
          <MetricStatCard key={card.label} {...card} />
        ))}
      </div>

      <ModuleFilters
        title="Filter Coupons"
        description="Filter coupon campaigns by scheduling window, status, and store applicability"
        countryId={draft.country}
        onCountryChange={(v) => setDraft((p) => ({ ...p, country: v }))}
        cityId={draft.city}
        onCityChange={(v) => setDraft((p) => ({ ...p, city: v }))}
        hideCountryFilter={true}
        hideCityFilter={true}
        hasFilters={hasFilters}
        onClearFilters={handleClearFilters}
        onApplyFilters={() => {
          apply();
          setPage(1);
        }}
        onCancelFilters={cancel}
        activeFilterCount={activeFilterCount}
      >
        <div className="min-w-[280px] flex-1 sm:min-w-[320px]">
          <DateRangeFilter
            fromDate={draft.fromDate}
            toDate={draft.toDate}
            onFromDateChange={(d) => setDraft((p) => ({ ...p, fromDate: d ?? undefined }))}
            onToDateChange={(d) => setDraft((p) => ({ ...p, toDate: d ?? undefined }))}
            maxDate={undefined}
          />
        </div>

        <div className="min-w-36 flex-1 space-y-1 sm:min-w-44">
          <Label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Status
          </Label>
          <Select
            value={draft.statusFilter}
            onValueChange={(v) => setDraft((p) => ({ ...p, statusFilter: v ?? "all" }))}
          >
            <SelectTrigger className="h-10 w-full rounded-xl border-slate-200/80 bg-white px-3 text-sm font-medium dark:border-slate-800 dark:bg-slate-900">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isSuperAdmin && (
          <div className="min-w-44 flex-1 space-y-1 sm:min-w-56">
            <Label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Target Store
            </Label>
            <StoreSelect
              value={draft.storeId}
              onValueChange={(v) => setDraft((p) => ({ ...p, storeId: v || "all" }))}
              includeAll={true}
              allLabel="All Stores (Global & Specific)"
              placeholder="All Stores"
              className="h-10 text-xs"
            />
          </div>
        )}
      </ModuleFilters>

      {/* Coupons DataTable Card */}
      <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
        <CardHeader className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary ring-primary/20 flex size-10 items-center justify-center rounded-xl ring-1">
              <Ticket className="size-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Coupon Registry
              </CardTitle>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {pagination.total} coupon{pagination.total !== 1 ? "s" : ""} registered in system
              </p>
            </div>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search code, name, creator..."
              className="h-10 rounded-xl pl-9 text-xs"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <DataTable
            columns={couponColumns}
            data={coupons}
            loading={isLoading || isFetching}
            currentPage={page}
            totalPages={pagination.totalPages}
            rowsPerPage={limit}
            onPageChange={(p) => setPage(p)}
            onRowsPerPageChange={(l) => {
              setLimit(l);
              setPage(1);
            }}
            manualPagination={true}
            manualSorting={true}
            onSortingChange={(newSorting) => {
              setSorting(newSorting);
              setPage(1);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
