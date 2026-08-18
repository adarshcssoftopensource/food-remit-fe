import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, HandPlatter, Package, Users } from "lucide-react";
import Link from "next/link";
import type { DashboardOverviewStats } from "../types/dashboard.types";

interface OverviewStatsProps {
  stats?: DashboardOverviewStats;
  isLoading?: boolean;
}

export function OverviewStats({ stats, isLoading }: OverviewStatsProps) {
  const cards = [
    {
      title: "Food Sent",
      href: "/order-management/sent-orders",
      icon: Package,
      iconBg: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
      mainValue: stats?.foodSent.today ?? 0,
      mainLabel: "Today",
      subStats: [
        { label: "Week", value: stats?.foodSent.thisWeek ?? 0 },
        { label: "Month", value: stats?.foodSent.thisMonth ?? 0 },
        { label: "Year", value: stats?.foodSent.thisYear ?? 0 },
      ],
    },
    {
      title: "Food Requested",
      href: "/order-management/requested-orders",
      icon: HandPlatter,
      iconBg: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
      mainValue: stats?.foodRequested.today ?? 0,
      mainLabel: "Today",
      subStats: [
        { label: "Week", value: stats?.foodRequested.thisWeek ?? 0 },
        { label: "Month", value: stats?.foodRequested.thisMonth ?? 0 },
        { label: "Year", value: stats?.foodRequested.thisYear ?? 0 },
      ],
    },
    {
      title: "Registered Users",
      href: "/users-management",
      icon: Users,
      iconBg: "bg-violet-50 text-violet-600 group-hover:bg-violet-100",
      mainValue: stats?.registeredUsers.users ?? 0,
      mainLabel: "Users",
      subStats: [
        { label: "Active", value: stats?.registeredUsers.activeUsers ?? 0 },
        { label: "Inactive", value: stats?.registeredUsers.inactiveUsers ?? 0 },
      ],
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {cards.map(({ title, href, icon: Icon, iconBg, mainValue, mainLabel, subStats }) => (
        <Link key={title} href={href} className="group block">
          <Card className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-sm font-medium text-slate-500">{title}</p>
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 transition-colors group-hover:text-slate-600" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  {isLoading ? (
                    <Skeleton className="h-10 w-20 rounded-lg" />
                  ) : (
                    <>
                      <span className="text-primary text-4xl font-black tracking-tight">
                        {mainValue}
                      </span>
                      <span className="text-sm font-medium text-slate-500">{mainLabel}</span>
                    </>
                  )}
                </div>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${iconBg}`}
              >
                <Icon size={24} />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-6 border-t border-slate-100 pt-4">
              {subStats.map((sub) => (
                <div key={sub.label} className="flex flex-col">
                  {isLoading ? (
                    <Skeleton className="my-0.5 h-6 w-12 rounded" />
                  ) : (
                    <span className="text-lg font-bold text-slate-800">{sub.value}</span>
                  )}
                  <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    {sub.label}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
