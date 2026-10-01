import { format } from "date-fns";
import { Gift, RotateCcw, Sparkles, TrendingUp } from "lucide-react";
import type { SortingState } from "@tanstack/react-table";

import type { CouponItem, CouponStats } from "./types/coupon.types";

type CouponExportColumn = {
  label: string;
  key: keyof CouponItem | ((item: CouponItem, index: number) => unknown);
};

export const COUPON_EXPORT_COLUMNS: CouponExportColumn[] = [
  { label: "Sr.No", key: (_, index) => index + 1 },
  { label: "Coupon Code", key: "couponCode" },
  { label: "Coupon Name", key: "couponName" },
  { label: "Discount", key: (item) => `${item.discount}% OFF` },
  {
    label: "Scope / Store",
    key: (item) => (item.isGlobal ? "All Stores (Global)" : item.storeName),
  },
  {
    label: "Valid From",
    key: (item) => (item.startDate ? format(new Date(item.startDate), "yyyy-MM-dd HH:mm") : "—"),
  },
  {
    label: "Valid To",
    key: (item) => (item.endDate ? format(new Date(item.endDate), "yyyy-MM-dd HH:mm") : "—"),
  },
  { label: "Min Order ($)", key: (item) => `$${item.minOrderValue}` },
  { label: "Max Users", key: (item) => item.maxUsers ?? "Unlimited" },
  { label: "Redeemed Count", key: "redeemedCoupons" },
  { label: "Created By Role", key: "createdBy" },
  { label: "Created By Name", key: "createdName" },
  { label: "Status", key: "status" },
  {
    label: "Created Date",
    key: (item) => (item.createdAt ? format(new Date(item.createdAt), "yyyy-MM-dd HH:mm") : "—"),
  },
];

export function getSortOrder(sorting: SortingState): "asc" | "desc" | undefined {
  return sorting[0] ? (sorting[0].desc ? "desc" : "asc") : undefined;
}

type AppliedCouponFilters = {
  fromDate?: Date;
  toDate?: Date;
  statusFilter: string;
  storeId: string;
};

export function hasActiveCouponFilters(applied: AppliedCouponFilters) {
  return Boolean(
    applied.fromDate ||
    applied.toDate ||
    applied.statusFilter !== "all" ||
    (applied.storeId && applied.storeId !== "all"),
  );
}

export function getCouponMetricCards(stats: CouponStats) {
  return [
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
}
