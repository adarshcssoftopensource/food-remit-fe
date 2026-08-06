"use client";

import { Filter, Gift, RotateCcw, Sparkles, Ticket, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";

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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CouponRow, CouponStatus, INITIAL_COUPONS } from "@/constants/coupons-managemant";
import { couponColumns } from "./columns/coupon-columns";
import { AddCouponDialog } from "./components/add-coupon-dialog";
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
  const [statusFilter, setStatusFilter] = useState<CouponStatus>("All");
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);

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
      if (statusFilter !== "All" && coupon.status !== statusFilter) {
        return false;
      }

      if (fromDate && coupon.createdAt < fromDate) {
        return false;
      }

      if (toDate && coupon.createdAt > toDate) {
        return false;
      }

      return true;
    });
  }, [coupons, fromDate, statusFilter, toDate]);

  const hasFilters = Boolean(fromDate || toDate || statusFilter !== "All");

  const handleClearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setStatusFilter("All");
  };

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
      iconWrapperClassName: "bg-amber-100",
    },
    {
      label: "Active Coupons",
      value: stats.activeCount,
      trendLabel: "Currently available",
      trendValue: "+8%",
      icon: Gift,
      iconClassName: "text-emerald-600",
      iconWrapperClassName: "bg-emerald-100",
    },
    {
      label: "Inactive Coupons",
      value: stats.inactiveCount,
      trendLabel: "Paused offers",
      trendValue: "-4%",
      icon: RotateCcw,
      iconClassName: "text-slate-700",
      iconWrapperClassName: "bg-slate-100",
    },
    {
      label: "Redeemed Coupons",
      value: stats.redeemedCoupons,
      trendLabel: "Total redemptions",
      trendValue: "+22%",
      icon: TrendingUp,
      iconClassName: "text-blue-600",
      iconWrapperClassName: "bg-blue-100",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coupons Management"
        description="Create, manage, and review coupons with active / inactive filters, date controls, and quick search."
        action={<AddCouponDialog onCreate={handleAddCoupon} />}
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => (
          <MetricStatCard key={card.label} {...card} />
        ))}
      </div>

      <Card className="rounded-3xl border bg-white shadow-sm">
        <CardHeader className="border-b py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary rounded-2xl p-3">
              <Filter className="size-5" />
            </div>
            <CardTitle className="text-lg font-semibold">Filters</CardTitle>
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

            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs font-medium uppercase">Status</Label>
              <Select value={statusFilter} onValueChange={() => setStatusFilter}>
                <SelectTrigger className="h-11! w-full rounded-xl">
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

            <div className="mb-2 flex items-end">
              <Button
                variant="destructive"
                onClick={handleClearFilters}
                disabled={!hasFilters}
                className="h-11 w-32 rounded-xl"
              >
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl shadow-sm">
        <CardHeader className="flex flex-col gap-4 border-b bg-gray-50/50 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-11 items-center justify-center rounded-xl bg-blue-100 shadow-sm">
              <Ticket className="size-5 text-[#1B3A8C]" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">Coupon Registry</CardTitle>

              <p className="text-muted-foreground mt-1 text-sm">
                Manage and track all coupon campaigns
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={couponColumns} data={filteredData} searchKey="couponName" />
        </CardContent>
      </Card>
    </div>
  );
}
