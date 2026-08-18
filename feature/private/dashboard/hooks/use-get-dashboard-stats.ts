import { useApiQuery } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { DASHBOARD_ENDPOINTS } from "@/lib/api/endpoints/dashboard.endpoints";
import { buildCacheKey, buildUrl } from "@/lib/build-query-string";
import type { DashboardData, DashboardStatsApiResponse } from "../types/dashboard.types";

export interface UseGetDashboardStatsArgs {
  countryId?: string;
  cityId?: string;
  [key: string]: unknown;
}

const DEFAULT_DASHBOARD_DATA: DashboardData = {
  overviewStats: {
    foodSent: { today: 0, thisWeek: 0, thisMonth: 0, thisYear: 0, total: 0 },
    foodRequested: { today: 0, thisWeek: 0, thisMonth: 0, thisYear: 0, total: 0 },
    registeredUsers: {
      users: 0,
      activeUsers: 0,
      inactiveUsers: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      thisYear: 0,
      philanthropists: 0,
      foundations: 0,
    },
  },
  managementStats: {
    countryManager: 0,
    cityManager: 0,
    storeManager: 0,
    employees: 0,
    subAdmins: 0,
  },
  financialStats: {
    amountCollectedToday: "0 USD",
    itemsSentToday: 0,
  },
  salesOverview: {
    salesGraph: "0 USD",
    newUsers: 0,
    totalOrders: 0,
  },
  storesSummary: {
    totalStores: 0,
    newStoreListings: [],
  },
  recentTickets: [],
  recentOrdersRequested: [],
  recentlyPlacedOrders: [],
  trendingOrders: [],
};

export function useGetDashboardStats(args: UseGetDashboardStatsArgs = {}) {
  const url = buildUrl(DASHBOARD_ENDPOINTS.GET_DASHBOARD, args);
  const cacheKey = buildCacheKey(API_CACHE_KEYS.DASHBOARD[0], args);

  const query = useApiQuery<DashboardStatsApiResponse>(cacheKey, url, {
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });

  const dashboardData: DashboardData = query.data?.data ?? DEFAULT_DASHBOARD_DATA;

  return {
    ...query,
    dashboardData,
  };
}
