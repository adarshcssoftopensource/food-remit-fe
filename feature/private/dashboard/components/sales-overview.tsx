"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { DASHBOARD_ROUTES } from "@/constants/dashboard";
import { ShoppingBag, TrendingUp, UserPlus } from "lucide-react";
import type { DashboardSalesOverview } from "../types/dashboard.types";
import { DashboardCard } from "./common/dashboard-card";

interface SalesOverviewProps {
  stats?: DashboardSalesOverview;
  isLoading?: boolean;
}

export function SalesOverview({ stats, isLoading = false }: SalesOverviewProps) {
  const salesItems = [
    {
      title: "Sales Total",
      value: stats?.salesGraph ?? "0 USD",
      icon: TrendingUp,
      iconBg: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400",
      accentBorder: "group-hover:border-rose-500/30",
    },
    {
      title: "New Users (7d)",
      href: DASHBOARD_ROUTES.USERS,
      value: stats?.newUsers ?? 0,
      icon: UserPlus,
      iconBg: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400",
      accentBorder: "group-hover:border-indigo-500/30",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders ?? 0,
      icon: ShoppingBag,
      iconBg: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
      accentBorder: "group-hover:border-amber-500/30",
    },
  ];

  return (
    <DashboardCard
      title="Sales Overview"
      subtitle="Volume trends, order acquisitions, and recent user signups"
      accentColor="rose"
      icon={
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
          <TrendingUp className="h-4.5 w-4.5" />
        </div>
      }
      contentClassName="p-5 sm:p-6"
    >
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3">
        {salesItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={`group flex min-w-0 flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-4.5 transition-colors transition-shadow transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md dark:border-slate-800/80 dark:bg-slate-800/40 dark:hover:bg-slate-800 ${item.accentBorder}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-lg shadow-2xs ${item.iconBg}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <p className="truncate text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    {item.title}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                {isLoading ? (
                  <Skeleton className="h-8 w-16 rounded-lg" />
                ) : (
                  <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}
