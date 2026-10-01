"use client";

import { PageHeader } from "@/components/common/page-header";
import { useProfile } from "@/components/providers/profile-provider";
import { ROUTES } from "@/config/routes";
import { Store, Ticket } from "lucide-react";
import { useGetDashboardStats } from "../hooks/use-get-dashboard-stats";
import { buildDashboardTopCards } from "./common/build-dashboard-top-cards";
import { DashboardOrdersSections } from "./common/dashboard-orders-sections";
import { DashboardStatCard } from "./common/dashboard-stat-card";
import { DashboardErrorState } from "./index";

export function CityManagerDashboard() {
  const { profile } = useProfile();
  const { dashboardData: rawData, isLoading, isError, error, refetch } = useGetDashboardStats();
  const dashboardData = rawData as any; // Cast to bypass type errors for new structure

  const welcomeMessage = profile?.name ? `Welcome ${profile.name}` : undefined;

  const topCards = buildDashboardTopCards(dashboardData);

  return (
    <div className="relative min-h-[calc(100vh-8rem)] space-y-6">
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="City Manager Dashboard"
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

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
        <DashboardStatCard
          title="Managed Stores"
          href={ROUTES.ADMIN.STORE_MANAGEMENT.ROOT}
          icon={Store}
          accentColor="cyan"
          iconBgClassName="bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400"
          mainValue={dashboardData?.storesSummary?.totalStores ?? 0}
          isLoading={isLoading}
        />
        <DashboardStatCard
          title="Open Ticket"
          href={ROUTES.ADMIN.TICKET_MANAGEMENT.ROOT}
          icon={Ticket}
          accentColor="rose"
          iconBgClassName="bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
          mainValue={dashboardData?.totalOpenTickets ?? 0}
          isLoading={isLoading}
        />
      </div>

      <DashboardOrdersSections dashboardData={dashboardData} isLoading={isLoading} />
    </div>
  );
}
