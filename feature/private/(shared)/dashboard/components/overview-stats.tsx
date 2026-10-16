"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { DASHBOARD_ROUTES } from "@/constants/dashboard";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";
import { ArrowUpRight, HandPlatter, Package, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import type { DashboardOverviewStats } from "../types/dashboard.types";

interface OverviewStatsProps {
  stats?: DashboardOverviewStats;
  isLoading?: boolean;
}

export function OverviewStats({ stats, isLoading = false }: OverviewStatsProps) {
  const cards = [
    {
      title: "Food Sent",
      subtitle: "Dispatched & Delivered",
      href: ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT,
      icon: Package,
      today: stats?.foodSent.today ?? 0,
      todayLabel: "Today",
      accentGradient: "from-emerald-500 via-emerald-400 to-teal-400",
      ambientGlow: "from-emerald-500/12 via-teal-500/5 to-transparent",
      iconBox:
        "bg-linear-to-b from-emerald-50 to-emerald-100/50 text-emerald-700 border-emerald-200/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:from-emerald-950/60 dark:to-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/80",
      pillBadge:
        "bg-emerald-50/90 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
      dotPulse: "bg-emerald-500",
      subStats: [
        { label: "This Week", value: stats?.foodSent.thisWeek ?? 0 },
        { label: "This Month", value: stats?.foodSent.thisMonth ?? 0 },
        { label: "This Year", value: stats?.foodSent.thisYear ?? 0 },
      ],
      is4Grid: false,
    },
    {
      title: "Food Requested",
      subtitle: "Beneficiary grocery demand",
      href: ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT,
      icon: HandPlatter,
      today: stats?.foodRequested.today ?? 0,
      todayLabel: "Today",
      accentGradient: "from-teal-500 via-teal-400 to-cyan-400",
      ambientGlow: "from-teal-500/12 via-cyan-500/5 to-transparent",
      iconBox:
        "bg-linear-to-b from-teal-50 to-teal-100/50 text-teal-700 border-teal-200/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:from-teal-950/60 dark:to-teal-900/30 dark:text-teal-400 dark:border-teal-800/80",
      pillBadge:
        "bg-teal-50/90 text-teal-800 border-teal-200/80 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800",
      dotPulse: "bg-teal-500",
      subStats: [
        { label: "This Week", value: stats?.foodRequested.thisWeek ?? 0 },
        { label: "This Month", value: stats?.foodRequested.thisMonth ?? 0 },
        { label: "This Year", value: stats?.foodRequested.thisYear ?? 0 },
      ],
      is4Grid: false,
    },
    {
      title: "Registered Users",
      subtitle: "Verified community accounts",
      href: DASHBOARD_ROUTES.USERS,
      icon: Users,
      today: stats?.registeredUsers.users ?? 0,
      todayLabel: "Total Accounts",
      accentGradient:
        "from-slate-700 via-slate-800 to-slate-900 dark:from-slate-300 dark:to-slate-100",
      ambientGlow: "from-indigo-500/10 via-purple-500/5 to-transparent",
      iconBox:
        "bg-linear-to-b from-indigo-50 to-indigo-100/50 text-indigo-700 border-indigo-200/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:from-indigo-950/60 dark:to-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800/80",
      pillBadge:
        "bg-indigo-50/90 text-indigo-800 border-indigo-200/80 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800",
      dotPulse: "bg-indigo-500",
      subStats: [
        {
          label: "Active",
          value: stats?.registeredUsers.activeUsers ?? 0,
          dot: "bg-emerald-500 ring-2 ring-emerald-500/20",
        },
        {
          label: "Inactive",
          value: stats?.registeredUsers.inactiveUsers ?? 0,
          dot: "bg-slate-400 ring-2 ring-slate-400/20",
        },
        {
          label: "Philanthropists",
          value: stats?.registeredUsers.philanthropists ?? 0,
          dot: "bg-amber-500 ring-2 ring-amber-500/20",
        },
        {
          label: "Foundations",
          value: stats?.registeredUsers.foundations ?? 0,
          dot: "bg-indigo-500 ring-2 ring-indigo-500/20",
        },
      ],
      is4Grid: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.title}
            href={card.href}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-linear-to-b from-white via-white to-slate-50/50 p-4 hover:border-slate-300 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900/70 dark:hover:border-slate-700"
          >
            <div
              className={cn(
                "absolute inset-x-0 top-0 h-[2.5px] bg-linear-to-r",
                card.accentGradient,
              )}
            />

            <div
              className={cn(
                "pointer-events-none absolute -top-14 -right-14 size-32 rounded-full bg-linear-to-br opacity-40 blur-2xl transition-opacity duration-300 group-hover:opacity-100",
                card.ambientGlow,
              )}
            />

            <div className="relative">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      {card.title}
                    </span>
                    <ArrowUpRight className="size-3.5 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-800 dark:text-slate-600 dark:group-hover:text-slate-200" />
                  </div>
                  <p className="mt-0.5 truncate text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    {card.subtitle}
                  </p>
                </div>

                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-105 group-hover:shadow-xs",
                    card.iconBox,
                  )}
                >
                  <Icon className="size-4.5" />
                </div>
              </div>

              {/* Main Metric Value */}
              <div className="mt-3.5 flex items-baseline gap-2.5">
                {isLoading ? (
                  <Skeleton className="h-9 w-24 rounded-lg" />
                ) : (
                  <span className="text-3xl font-black tracking-tight text-slate-900 tabular-nums sm:text-4xl dark:text-white">
                    {card.today.toLocaleString()}
                  </span>
                )}
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold shadow-2xs backdrop-blur-xs",
                    card.pillBadge,
                  )}
                >
                  <span className="relative flex size-1.5">
                    <span
                      className={cn(
                        "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                        card.dotPulse,
                      )}
                    />
                    <span
                      className={cn("relative inline-flex size-1.5 rounded-full", card.dotPulse)}
                    />
                  </span>
                  {card.todayLabel}
                </span>
              </div>
            </div>

            {/* Substats Section */}
            <div className="relative mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
              {card.is4Grid ? (
                <div className="grid grid-cols-2 gap-1.5">
                  {card.subStats.map((sub: any) => (
                    <div
                      key={sub.label}
                      className="group/item border-slate-150/70 flex items-center justify-between rounded-xl border bg-slate-50/80 px-2.5 py-1.5 transition-all hover:border-slate-200 hover:bg-white hover:shadow-2xs dark:border-slate-700/60 dark:bg-slate-800/40 dark:hover:bg-slate-800"
                    >
                      <div className="flex min-w-0 items-center gap-1.5">
                        <span className={cn("size-1.5 shrink-0 rounded-full", sub.dot)} />
                        <span className="truncate text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
                          {sub.label}
                        </span>
                      </div>
                      {isLoading ? (
                        <Skeleton className="h-3.5 w-6 rounded" />
                      ) : (
                        <span className="ml-1 text-xs font-black text-slate-900 tabular-nums dark:text-slate-100">
                          {sub.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-slate-150/70 grid grid-cols-3 divide-x divide-slate-200/60 rounded-xl border bg-slate-50/80 p-1 dark:divide-slate-700/60 dark:border-slate-700/60 dark:bg-slate-800/40">
                  {card.subStats.map((sub) => (
                    <div
                      key={sub.label}
                      className="group/item dark:hover:bg-slate-850 rounded-lg px-1.5 py-1 text-center transition-all hover:bg-white hover:shadow-2xs"
                    >
                      <span className="block text-[9.5px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                        {sub.label}
                      </span>
                      {isLoading ? (
                        <Skeleton className="mx-auto mt-1 h-4 w-8 rounded" />
                      ) : (
                        <span className="mt-0.5 block text-xs font-black text-slate-900 tabular-nums dark:text-slate-100">
                          {sub.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
