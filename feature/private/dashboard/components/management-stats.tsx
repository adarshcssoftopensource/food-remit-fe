import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, Users } from "lucide-react";
import Link from "next/link";
import type { DashboardManagementStats } from "../types/dashboard.types";

interface ManagementStatsProps {
  stats?: DashboardManagementStats;
  isLoading?: boolean;
}

export function ManagementStats({ stats, isLoading }: ManagementStatsProps) {
  const managementItems = [
    {
      title: "Country Manager",
      href: "/country-management/list",
      value: stats?.countryManager ?? 0,
    },
    {
      title: "City Manager",
      href: "/city-management/list",
      value: stats?.cityManager ?? 0,
    },
    {
      title: "Store Manager",
      href: "/store-management",
      value: stats?.storeManager ?? 0,
    },
    {
      title: "Employees",
      href: "/sub-admin-management",
      value: stats?.employees ?? 0,
    },
  ];

  return (
    <Card className="rounded-2xl border border-slate-200/60 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Users size={22} />
          </div>
          <h3 className="text-base font-bold text-slate-800">Management Statistics</h3>
        </div>
      </div>
      <div className="grid grid-cols-2 divide-y divide-slate-100 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        {managementItems.map((stat, i) => (
          <Link
            key={i}
            href={stat.href}
            className="group flex flex-col justify-center px-6 py-4 transition-colors hover:bg-slate-50/70"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                {stat.title}
              </p>
              <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 opacity-0 transition-all group-hover:text-slate-600 group-hover:opacity-100" />
            </div>
            <div className="text-primary mt-3 text-4xl font-black tracking-tight">
              {isLoading ? <Skeleton className="h-10 w-16 rounded-lg" /> : stat.value}
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
