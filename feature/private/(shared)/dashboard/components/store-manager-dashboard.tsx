"use client";

import { PageHeader } from "@/components/common/page-header";
import { useProfile } from "@/components/providers/profile-provider";
import { useGetDashboardStats } from "../hooks/use-get-dashboard-stats";
import { buildDashboardTopCards } from "./common/build-dashboard-top-cards";
import { DashboardOrdersSections } from "./common/dashboard-orders-sections";
import { DashboardStatCard } from "./common/dashboard-stat-card";
import { DashboardErrorState } from "./index";

export function StoreManagerDashboard() {
  const { profile } = useProfile();
  const { dashboardData: rawData, isLoading, isError, error, refetch } = useGetDashboardStats();
  const dashboardData = rawData as any; // Cast to bypass type errors for new structure

  const welcomeMessage = profile?.stores?.[0]?.storeName
    ? `Welcome, ${profile.stores[0].storeName}`
    : undefined;

  const topCards = buildDashboardTopCards(dashboardData);

  return (
    <div className="relative min-h-[calc(100vh-8rem)] space-y-6">
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Store Overview"
          description="Real-time performance analytics and metrics for your assigned stores."
          welcomeMessage={welcomeMessage}
        />
      </div>

      {isError && (
        <DashboardErrorState
          message={(error as Error)?.message || "Unable to fetch the latest dashboard statistics."}
          onRetry={() => refetch()}
        />
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {topCards.map((card) => (
          <DashboardStatCard key={card.title} {...card} isLoading={isLoading} />
        ))}
      </div>

      <DashboardOrdersSections dashboardData={dashboardData} isLoading={isLoading} />
    </div>
  );
}
