import { DEFAULT_DASHBOARD_DATA } from "@/constants/dashboard";
import { useApiQuery } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { DASHBOARD_ENDPOINTS } from "@/lib/api/endpoints/dashboard.endpoints";
import { buildCacheKey, buildUrl } from "@/lib/build-query-string";
import type {
  DashboardData,
  DashboardFiltersState,
  DashboardStatsApiResponse,
} from "../types/dashboard.types";

export type UseGetDashboardStatsArgs = DashboardFiltersState;

export function useGetDashboardStats(args: UseGetDashboardStatsArgs = {}) {
  const cleanArgs: Record<string, unknown> = {};
  if (args.countryId && args.countryId !== "All" && args.countryId !== "all") {
    cleanArgs.countryId = args.countryId;
  }
  if (args.cityId && args.cityId !== "All" && args.cityId !== "all") {
    cleanArgs.cityId = args.cityId;
  }

  const url = buildUrl(DASHBOARD_ENDPOINTS.GET_DASHBOARD, cleanArgs);
  const cacheKey = buildCacheKey(API_CACHE_KEYS.DASHBOARD[0], cleanArgs);

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
