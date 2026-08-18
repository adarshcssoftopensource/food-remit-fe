import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, Banknote } from "lucide-react";
import Link from "next/link";
import type { DashboardFinancialStats } from "../types/dashboard.types";

interface FinancialStatsProps {
  stats?: DashboardFinancialStats;
  isLoading?: boolean;
}

export function FinancialStats({ stats, isLoading }: FinancialStatsProps) {
  const financialItems = [
    {
      title: "Amount Collected Today",
      href: "/order-management/history",
      value: stats?.amountCollectedToday ?? "0 USD",
    },
    {
      title: "Count Of Items Sent Today",
      href: "/order-management/sent-orders",
      value: stats?.itemsSentToday ?? 0,
    },
  ];

  return (
    <Card className="rounded-2xl border border-slate-200/60 shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          <Banknote size={22} />
        </div>
        <h3 className="text-base font-bold text-slate-800">Financial Statistics</h3>
      </div>
      <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        {financialItems.map((stat, i) => (
          <Link
            key={i}
            href={stat.href}
            className="group flex flex-col justify-center px-6 py-8 transition-colors hover:bg-slate-50/70"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                {stat.title}
              </p>
              <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 opacity-0 transition-all group-hover:text-slate-600 group-hover:opacity-100" />
            </div>
            <div className="text-primary mt-3 text-4xl font-black tracking-tight">
              {isLoading ? <Skeleton className="h-10 w-24 rounded-lg" /> : stat.value}
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
