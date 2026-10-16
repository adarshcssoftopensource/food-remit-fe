"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { DASHBOARD_ROUTES } from "@/constants/dashboard";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Globe, MapPin, Store, UserCog, Users } from "lucide-react";
import Link from "next/link";
import type { DashboardManagementStats } from "../types/dashboard.types";

interface ManagementStatsProps {
  stats?: DashboardManagementStats;
  isLoading?: boolean;
}

export function ManagementStats({ stats, isLoading = false }: ManagementStatsProps) {
  const managementItems = [
    {
      title: "Country Manager",
      shortLabel: "CM",
      href: DASHBOARD_ROUTES.COUNTRY_MANAGERS,
      value: stats?.countryManager ?? 0,
      icon: Globe,
      accentBorder: "from-blue-500/80 to-blue-600/30",
      iconBox:
        "bg-blue-50/80 text-blue-700 border-blue-200/70 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/60",
      tagBox: "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/50 dark:text-blue-300",
    },
    {
      title: "City Manager",
      shortLabel: "CTM",
      href: DASHBOARD_ROUTES.CITY_MANAGERS,
      value: stats?.cityManager ?? 0,
      icon: MapPin,
      accentBorder: "from-teal-500/80 to-teal-600/30",
      iconBox:
        "bg-teal-50/80 text-teal-700 border-teal-200/70 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-900/60",
      tagBox: "bg-teal-50 text-teal-700 border-teal-200/60 dark:bg-teal-950/50 dark:text-teal-300",
    },
    {
      title: "Store Manager",
      shortLabel: "SM",
      href: DASHBOARD_ROUTES.STORE_MANAGERS,
      value: stats?.storeManager ?? 0,
      icon: Store,
      accentBorder: "from-amber-500/80 to-amber-600/30",
      iconBox:
        "bg-amber-50/80 text-amber-700 border-amber-200/70 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/60",
      tagBox:
        "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/50 dark:text-amber-300",
    },
    {
      title: "Sub Admins",
      shortLabel: "SA",
      href: DASHBOARD_ROUTES.SUB_ADMINS,
      value: stats?.subAdmins ?? 0,
      icon: UserCog,
      accentBorder: "from-purple-500/80 to-purple-600/30",
      iconBox:
        "bg-purple-50/80 text-purple-700 border-purple-200/70 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/60",
      tagBox:
        "bg-purple-50 text-purple-700 border-purple-200/60 dark:bg-purple-950/50 dark:text-purple-300",
    },
    {
      title: "Employees",
      shortLabel: "EMP",
      href: DASHBOARD_ROUTES.SUB_ADMINS,
      value: stats?.employees ?? 0,
      icon: Users,
      accentBorder: "from-emerald-500/80 to-emerald-600/30",
      iconBox:
        "bg-emerald-50/80 text-emerald-700 border-emerald-200/70 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/60",
      tagBox:
        "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/50 dark:text-emerald-300",
    },
  ];

  const totalStaff = managementItems.reduce((acc, curr) => acc + (curr.value || 0), 0);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-linear-to-b from-white via-white to-slate-50/50 p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.04)] backdrop-blur-xl sm:p-5 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900/70">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-16 left-1/4 h-32 w-64 rounded-full bg-emerald-500/5 blur-3xl" />

      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-primary flex size-9 shrink-0 items-center justify-center rounded-xl text-white shadow-xs dark:bg-white dark:text-slate-900">
            <Users className="size-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              Management Overview
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Role-based administration and staff distribution
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-2xs dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span>{isLoading ? "..." : totalStaff.toLocaleString()} Total Personnel</span>
          </span>
        </div>
      </div>

      <div className="mt-3.5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
        {managementItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className="group dark:bg-slate-850 relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
            >
              <div
                className={cn("absolute inset-x-0 top-0 h-0.5 bg-linear-to-r", item.accentBorder)}
              />

              <div className="relative flex items-center justify-between">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg border shadow-2xs transition-transform duration-300 group-hover:scale-105",
                    item.iconBox,
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={cn(
                      "rounded-md border px-1.5 py-0.5 text-[9.5px] font-bold tracking-wider uppercase shadow-2xs",
                      item.tagBox,
                    )}
                  >
                    {item.shortLabel}
                  </span>
                  <ArrowUpRight className="size-3 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-800 dark:text-slate-600 dark:group-hover:text-slate-200" />
                </div>
              </div>

              <div className="relative mt-3.5">
                <p className="truncate text-[10.5px] font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                  {item.title}
                </p>
                <div className="mt-0.5">
                  {isLoading ? (
                    <Skeleton className="h-7 w-12 rounded" />
                  ) : (
                    <span className="text-2xl font-black tracking-tight text-slate-900 tabular-nums sm:text-3xl dark:text-white">
                      {item.value.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
