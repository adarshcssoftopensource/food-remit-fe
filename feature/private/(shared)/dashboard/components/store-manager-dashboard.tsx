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
      <PageHeader
        title="Store Overview"
        description="Real-time performance analytics, live order feeds, and verified settlement metrics."
        welcomeMessage={welcomeMessage}
        action={
          <div className="inline-flex shrink-0 items-center gap-1.5 rounded-2xl border border-slate-200/90 bg-white/95 p-1 shadow-2xs backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50/80 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span className="whitespace-nowrap">Live Sync</span>
            </div>

            <div className="h-4 w-px bg-slate-200/80 dark:bg-slate-700" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-8 gap-1.5 rounded-xl px-2.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-100/80 hover:text-slate-900 active:scale-95 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <RefreshCw
                className={`size-3.5 transition-transform duration-500 ${
                  isFetching
                    ? "animate-spin text-emerald-600"
                    : "text-slate-400 group-hover:text-slate-700"
                }`}
              />
              <span className="whitespace-nowrap">{isFetching ? "Syncing..." : "Refresh"}</span>
            </Button>
          </div>
        }
      />

      {isError && (
        <DashboardErrorState
          message={(error as Error)?.message || "Unable to fetch the latest dashboard statistics."}
          onRetry={() => refetch()}
        />
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6">
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
