"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { PageHeader } from "@/components/common/page-header";
import { MetricStatCard } from "@/components/common/stats/metric-stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CouponRow, CouponStatus, INITIAL_COUPONS } from "@/constants/coupons-managemant";
import { Gift, RotateCcw, Sparkles, Ticket, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { couponColumns } from "./columns/coupon-columns";
import { AddCouponDialog } from "./components/add-coupon-dialog";
import { useFilterState } from "@/hooks/use-filter-state";
import { type CouponFormValues } from "./schema/coupon.schema";

const statusOptions: Array<{ label: string; value: CouponStatus }> = [
  { label: "All", value: "All" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

const formatDate = (date: Date) => date.toLocaleDateString("en-GB");

const generateCouponCode = (name: string) => {
  const slug = name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "")
    .slice(0, 6);
  return `${slug || "COUP"}${Math.floor(100 + Math.random() * 900)}`;
};

export function CouponsManagement() {
  const [coupons, setCoupons] = useState<CouponRow[]>(INITIAL_COUPONS);
  const { draft, setDraft, applied, apply, cancel, reset } = useFilterState({
    fromDate: undefined as Date | undefined,
    toDate: undefined as Date | undefined,
    statusFilter: "All" as CouponStatus,
    country: "all",
    city: "all",
  });

  const stats = useMemo(() => {
    const activeCount = coupons.filter((item) => item.status === "Active").length;
    const inactiveCount = coupons.filter((item) => item.status === "Inactive").length;
    const redeemedCoupons = coupons.reduce((total, item) => total + item.redeemedCoupons, 0);

    return {
      totalCoupons: coupons.length,
      activeCount,
      inactiveCount,
      redeemedCoupons,
    };
  }, [coupons]);

  const filteredData = useMemo(() => {
    return coupons.filter((coupon) => {
      if (applied.statusFilter !== "All" && coupon.status !== applied.statusFilter) {
        return false;
      }
      if (
        applied.country !== "all" &&
        applied.country !== "All" &&
        (coupon as any).countryId &&
        (coupon as any).countryId !== applied.country
      ) {
        return false;
      }
      if (
        applied.city !== "all" &&
        applied.city !== "All" &&
        (coupon as any).cityId &&
        (coupon as any).cityId !== applied.city
      ) {
        return false;
      }
      if (applied.fromDate && coupon.createdAt < applied.fromDate) {
        return false;
      }
      if (applied.toDate && coupon.createdAt > applied.toDate) {
        return false;
      }
      return true;
    });
  }, [
    coupons,
    applied.country,
    applied.city,
    applied.fromDate,
    applied.statusFilter,
    applied.toDate,
  ]);

  const hasFilters = Boolean(
    applied.fromDate ||
    applied.toDate ||
    applied.statusFilter !== "All" ||
    (applied.country !== "all" && applied.country !== "All") ||
    (applied.city !== "all" && applied.city !== "All"),
  );

  const handleClearFilters = () => {
    reset();
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (applied.fromDate || applied.toDate) count++;
    if (applied.country && applied.country !== "all" && applied.country !== "All") count++;
    if (applied.city && applied.city !== "all" && applied.city !== "All") count++;
    if (applied.statusFilter !== "All") count++;
    return count;
  }, [applied.fromDate, applied.toDate, applied.country, applied.city, applied.statusFilter]);

  const handleAddCoupon = (values: CouponFormValues) => {
    const nextCoupon: CouponRow = {
      couponName: values.couponName,
      couponCode: generateCouponCode(values.couponName),
      discount: values.discount,
      description: values.description,
      minOrderValue: values.minOrderValue,
      maxUsers: values.maxUsers,
      createdBy: "Admin",
      createdName: "Coupon Manager",
      createdOn: formatDate(new Date()),
      createdAt: new Date(),
      availableCount: 120,
      redeemedCoupons: 0,
      status: "Active",
    };

    setCoupons((current) => [nextCoupon, ...current]);
  };

  const metricCards = [
    {
      label: "Total Coupons",
      value: stats.totalCoupons,
      trendLabel: "Live campaigns",
      trendValue: "+12%",
      icon: Sparkles,
      iconClassName: "text-amber-600",
      iconWrapperClassName: "bg-amber-100 dark:bg-amber-950/40",
    },
    {
      label: "Active Coupons",
      value: stats.activeCount,
      trendLabel: "Currently available",
      trendValue: "+8%",
      icon: Gift,
      iconClassName: "text-emerald-600",
      iconWrapperClassName: "bg-emerald-100 dark:bg-emerald-950/40",
    },
    {
      label: "Inactive Coupons",
      value: stats.inactiveCount,
      trendLabel: "Paused offers",
      trendValue: "-4%",
      icon: RotateCcw,
      iconClassName: "text-slate-700 dark:text-slate-300",
      iconWrapperClassName: "bg-slate-100 dark:bg-slate-800",
    },
    {
      label: "Redeemed Coupons",
      value: stats.redeemedCoupons,
      trendLabel: "Total redemptions",
      trendValue: "+22%",
      icon: TrendingUp,
      iconClassName: "text-blue-600",
      iconWrapperClassName: "bg-blue-100 dark:bg-blue-950/40",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coupons Management"
        description="Create, manage, and review coupons with active / inactive filters, country, city, and date controls."
        action={<AddCouponDialog onCreate={handleAddCoupon} />}
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => (
          <MetricStatCard key={card.label} {...card} />
        ))}
      </div>

      <ModuleFilters
        title="Filter Coupons"
        description="Refine coupon campaigns by date, country, city, and status"
        countryId={draft.country}
        onCountryChange={(v) => setDraft((p) => ({ ...p, country: v }))}
        cityId={draft.city}
        onCityChange={(v) => setDraft((p) => ({ ...p, city: v }))}
        hasFilters={hasFilters}
        onClearFilters={handleClearFilters}
        onApplyFilters={apply}
        onCancelFilters={cancel}
        activeFilterCount={activeFilterCount}
      >
        <div className="min-w-[280px] flex-1 sm:min-w-[320px]">
          <DateRangeFilter
            fromDate={draft.fromDate}
            toDate={draft.toDate}
            onFromDateChange={(d) => setDraft((p) => ({ ...p, fromDate: d ?? undefined }))}
            onToDateChange={(d) => setDraft((p) => ({ ...p, toDate: d ?? undefined }))}
          />
        </div>

        <div className="min-w-36 flex-1 space-y-1 sm:min-w-44">
          <Label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Status
          </Label>
          <Select
            value={draft.statusFilter}
            onValueChange={(v) => setDraft((p) => ({ ...p, statusFilter: v as CouponStatus }))}
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
      </ModuleFilters>

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
                {filteredData.length} coupon{filteredData.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <DataTable columns={couponColumns} data={filteredData} searchKey="couponName" />
        </CardContent>
      </Card>
    </div>
  );
}
