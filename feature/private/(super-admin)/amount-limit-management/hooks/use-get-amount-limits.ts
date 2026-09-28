import { useApiQuery } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { AMOUNT_LIMIT_ENDPOINTS } from "@/lib/api/endpoints/amount-limit.endpoints";
import { buildUrl } from "@/lib/build-query-string";
import { useMemo } from "react";
import type {
  AmountLimitData,
  AmountLimitListResponse,
  RawAmountLimit,
  UseGetAmountLimitsArgs,
} from "../types/amount-limit.types";

export function useGetAmountLimits(args?: UseGetAmountLimitsArgs) {
  const queryString = buildUrl("", {
    page: args?.page?.toString(),
    limit: args?.limit?.toString(),
    search: args?.search,
    sortBy: args?.sortBy,
    sortOrder: args?.sortOrder,
    fromDate: args?.fromDate,
    toDate: args?.toDate,
  }).replace("?", "");

  const queryKey = [...API_CACHE_KEYS.AMOUNT_LIMITS, queryString];
  const url = `${AMOUNT_LIMIT_ENDPOINTS.GET_AMOUNT_LIMITS}?${queryString}`;

  const { data: rawData, isLoading, refetch } = useApiQuery<AmountLimitListResponse>(queryKey, url);

  const amountLimits = useMemo<AmountLimitData[]>(() => {
    if (!rawData?.data) return [];
    return rawData.data.map((item: RawAmountLimit) => ({
      id: item.id,
      countryName: item.countryName,
      amount: item.amount,
      currency: item.currency ?? null,
      email: item.email ?? null,
      createdAt: item.createdAt ? item.createdAt.split("T")[0] : (item.addedOn ?? ""),
    }));
  }, [rawData]);

  return {
    data: amountLimits,
    isLoading,
    refetch,
    pagination: rawData?.pagination,
  };
}
