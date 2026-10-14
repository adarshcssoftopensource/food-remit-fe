"use client";

import { PageHeader } from "@/components/common/page-header";
import { useProfile } from "@/providers/profile-provider";
import { useGetDashboardStats } from "../hooks/use-get-dashboard-stats";
import { buildDashboardTopCards } from "./common/build-dashboard-top-cards";
import { DashboardOrdersSections } from "./common/dashboard-orders-sections";
import { DashboardStatCard } from "./common/dashboard-stat-card";
import { DashboardErrorState } from "./index";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function StoreManagerDashboard() {
  const { profile } = useProfile();
  const {
    dashboardData: rawData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetDashboardStats();
  const dashboardData = rawData as any;

  const storeName = profile?.stores?.[0]?.storeName || profile?.name;
  const welcomeMessage = storeName ? `Welcome, ${storeName}` : undefined;

  // Build full 6 executive cards for store manager
  const topCards = buildDashboardTopCards(dashboardData, { includeExtended: true });

  return (
    <div className="relative min-h-[calc(100vh-8rem)] space-y-4 antialiased sm:space-y-5">
      <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <PageHeader
          title="Store Overview"
          description="Real-time performance analytics, live order feeds, and verified settlement metrics."
          welcomeMessage={welcomeMessage}
        />

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-2.5 py-1 text-xs font-semibold text-emerald-800 shadow-2xs backdrop-blur-xs sm:px-3 sm:py-1.5 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span>Live Sync</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex h-8.5 items-center gap-1.5 rounded-xl border-slate-200 bg-white/80 text-xs font-semibold text-slate-700 shadow-2xs backdrop-blur-md hover:bg-slate-50 sm:h-9 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200"
          >
            <RefreshCw
              className={`size-3.5 ${isFetching ? "animate-spin text-emerald-600" : ""}`}
            />
            <span>{isFetching ? "Syncing..." : "Refresh"}</span>
          </Button>
        </div>
      </div>

      {isError && (
        <DashboardErrorState
          message={(error as Error)?.message || "Unable to fetch the latest dashboard statistics."}
          onRetry={() => refetch()}
        />
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-3 xl:grid-cols-6">
        {topCards.map((card) => (
          <div key={card.title} className="h-full min-w-0">
            <DashboardStatCard {...card} isLoading={isLoading} />
          </div>
        ))}
      </div>

      <DashboardOrdersSections dashboardData={dashboardData} isLoading={isLoading} />
    </div>
  );
}
