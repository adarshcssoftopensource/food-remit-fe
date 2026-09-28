"use client";

import { DASHBOARD_ROUTES } from "@/constants/dashboard";
import { HandPlatter, Package, Users } from "lucide-react";
import type { DashboardOverviewStats } from "../types/dashboard.types";
import { DashboardStatCard } from "./common/dashboard-stat-card";
import { ROUTES } from "@/config/routes";

interface OverviewStatsProps {
  stats?: DashboardOverviewStats;
  isLoading?: boolean;
}

export function OverviewStats({ stats, isLoading = false }: OverviewStatsProps) {
  const cards = [
    {
      title: "Food Sent",
      href: ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT,
      icon: Package,
      accentColor: "emerald" as const,
      iconBgClassName:
        "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
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
      href: ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT,
      icon: HandPlatter,
      accentColor: "cyan" as const,
      iconBgClassName: "bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400",
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
      href: DASHBOARD_ROUTES.USERS,
      icon: Users,
      accentColor: "indigo" as const,
      iconBgClassName:
        "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400",
      mainValue: stats?.registeredUsers.users ?? 0,
      mainLabel: "Total Accounts",
      subStats: [
        { label: "Active", value: stats?.registeredUsers.activeUsers ?? 0 },
        { label: "Inactive", value: stats?.registeredUsers.inactiveUsers ?? 0 },
        { label: "Philanthropists", value: stats?.registeredUsers.philanthropists ?? 0 },
        { label: "Foundations", value: stats?.registeredUsers.foundations ?? 0 },
      ],
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <DashboardStatCard
          key={card.title}
          title={card.title}
          href={card.href}
          icon={card.icon}
          accentColor={card.accentColor}
          iconBgClassName={card.iconBgClassName}
          mainValue={card.mainValue}
          mainLabel={card.mainLabel}
          subStats={card.subStats}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
