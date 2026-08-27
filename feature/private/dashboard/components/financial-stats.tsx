"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { DASHBOARD_ROUTES } from "@/constants/dashboard";
import { Banknote, Coins, PackageCheck } from "lucide-react";
import type { DashboardFinancialStats } from "../types/dashboard.types";
import { DashboardCard } from "./common/dashboard-card";

interface FinancialStatsProps {
  stats?: DashboardFinancialStats;
  isLoading?: boolean;
}

export function FinancialStats({ stats, isLoading = false }: FinancialStatsProps) {
  const financialItems = [
    {
      title: "Amount Collected Today",
      value: stats?.amountCollectedToday ?? "0 USD",
      icon: Coins,
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
      accentBorder: "group-hover:border-emerald-500/30",
    },
    {
      title: "Items Sent Today",
      value: stats?.itemsSentToday ?? 0,
      icon: PackageCheck,
      iconBg: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
      accentBorder: "group-hover:border-blue-500/30",
    },
  ];

  return (
    <DashboardCard
      title="Financial Statistics"
      subtitle="Today's financial inflow and shipment velocity"
      accentColor="emerald"
      icon={
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
          <Banknote className="h-4.5 w-4.5" />
        </div>
      }
      contentClassName="p-5 sm:p-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {financialItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={`group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-5 transition-colors transition-shadow transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md dark:border-slate-800/80 dark:bg-slate-800/40 dark:hover:bg-slate-800 ${item.accentBorder}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg shadow-2xs ${item.iconBg}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    {item.title}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                {isLoading ? (
                  <Skeleton className="h-9 w-24 rounded-lg" />
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
