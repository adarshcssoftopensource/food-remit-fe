"use client";

import { Progress } from "@/components/ui/progress";
import { DEFAULT_MONTHLY_REVENUE } from "@/constants/dashboard";
import { TrendingUp } from "lucide-react";
import { DashboardCard } from "./common/dashboard-card";

interface MonthlyRevenueProps {
  revenueBreakdown?: { label: string; percentage: number }[];
  isLoading?: boolean;
}

export function MonthlyRevenue({
  revenueBreakdown = DEFAULT_MONTHLY_REVENUE,
  isLoading = false,
}: MonthlyRevenueProps) {
  const avgPercentage = Math.round(
    revenueBreakdown.reduce((acc, curr) => acc + curr.percentage, 0) /
      (revenueBreakdown.length || 1),
  );

  return (
    <DashboardCard
      title="Monthly Revenue"
      subtitle="Performance target breakdown by week"
      accentColor="emerald"
      icon={
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
          <TrendingUp className="h-4.5 w-4.5" />
        </div>
      }
      className="flex h-full flex-col justify-between"
      contentClassName="p-5 sm:p-6 flex-1 flex flex-col justify-between"
    >
      <div className="space-y-4.5">
        <div className="flex items-center justify-between rounded-xl border border-emerald-100/80 bg-emerald-50/70 p-3.5 dark:border-emerald-900/40 dark:bg-emerald-950/30">
          <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            Monthly Target Pace
          </span>
          <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
            {avgPercentage}% On Track
          </span>
        </div>

        <div className="space-y-4">
          {revenueBreakdown.map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
                <span className="text-primary text-xs font-black dark:text-emerald-400">
                  {item.percentage}%
                </span>
              </div>
              <Progress
                value={item.percentage}
                className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800"
              />
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}
