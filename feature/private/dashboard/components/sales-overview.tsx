import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { DashboardSalesOverview } from "../types/dashboard.types";

interface SalesOverviewProps {
  stats?: DashboardSalesOverview;
  isLoading?: boolean;
}

export function SalesOverview({ stats, isLoading }: SalesOverviewProps) {
  const salesItems = [
    {
      title: "Sells Graph",
      href: "/order-management/history",
      value: stats?.salesGraph ?? "0 USD",
    },
    {
      title: "New Users",
      href: "/users-management",
      value: stats?.newUsers ?? 0,
    },
    {
      title: "Total Orders",
      href: "/order-management/history",
      value: stats?.totalOrders ?? 0,
    },
  ];

  return (
    <Card className="rounded-2xl border border-slate-200/60 shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-50 text-pink-600">
          <TrendingUp size={16} />
        </div>
        <h3 className="text-base font-bold text-slate-800">Sales Overview</h3>
      </div>
      <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {salesItems.map((stat, i) => (
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
