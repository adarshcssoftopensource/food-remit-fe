"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { DASHBOARD_ROUTES } from "@/constants/dashboard";
import { ArrowUpRight, Globe, MapPin, Store, UserCog, Users } from "lucide-react";
import Link from "next/link";
import type { DashboardManagementStats } from "../types/dashboard.types";
import { DashboardCard } from "./common/dashboard-card";

interface ManagementStatsProps {
  stats?: DashboardManagementStats;
  isLoading?: boolean;
}

export function ManagementStats({ stats, isLoading = false }: ManagementStatsProps) {
  const managementItems = [
    {
      title: "Country Manager",
      roleCode: "CM",
      href: DASHBOARD_ROUTES.COUNTRY_MANAGERS,
      value: stats?.countryManager ?? 0,
      icon: Globe,
      iconBg: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
      accentBg: "group-hover:border-blue-500/30",
    },
    {
      title: "City Manager",
      roleCode: "CTM",
      href: DASHBOARD_ROUTES.CITY_MANAGERS,
      value: stats?.cityManager ?? 0,
      icon: MapPin,
      iconBg: "bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400",
      accentBg: "group-hover:border-teal-500/30",
    },
    {
      title: "Store Manager",
      roleCode: "SM",
      href: DASHBOARD_ROUTES.STORE_MANAGERS,
      value: stats?.storeManager ?? 0,
      icon: Store,
      iconBg: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
      accentBg: "group-hover:border-amber-500/30",
    },
    {
      title: "Sub Admins",
      roleCode: "SA",
      href: DASHBOARD_ROUTES.SUB_ADMINS,
      value: stats?.subAdmins ?? 0,
      icon: UserCog,
      iconBg: "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
      accentBg: "group-hover:border-purple-500/30",
    },
    {
      title: "Employees",
      roleCode: "EMP",
      href: DASHBOARD_ROUTES.SUB_ADMINS,
      value: stats?.employees ?? 0,
      icon: Users,
      iconBg: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400",
      accentBg: "group-hover:border-indigo-500/30",
    },
  ];

  return (
    <DashboardCard
      title="Management Overview"
      subtitle="Role-based administration and staff distribution"
      icon={
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
          <Users className="h-4.5 w-4.5" />
        </div>
      }
      contentClassName="p-5 sm:p-6"
    >
      <div className="grid min-w-0 grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
        {managementItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className={`group relative flex min-w-0 flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md dark:border-slate-800/80 dark:bg-slate-800/40 dark:hover:bg-slate-800 ${item.accentBg}`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg shadow-2xs transition-transform group-hover:scale-105 ${item.iconBg}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <ArrowUpRight className="group-hover:text-primary dark:group-hover:text-primary h-4 w-4 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 dark:text-slate-600" />
              </div>

              <div className="mt-4">
                <p className="truncate text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  {item.title}
                </p>
                <div className="mt-1">
                  {isLoading ? (
                    <Skeleton className="h-8 w-14 rounded-lg" />
                  ) : (
                    <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                      {item.value.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </DashboardCard>
  );
}
