import { useQuery } from "@tanstack/react-query";

import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { NOTIFICATION_ENDPOINTS } from "@/lib/api/endpoints/notification.endpoints";
import type { WebNotificationsResponse } from "../types/notification.types";

export type GetNotificationsParams = {
  page?: number;
  limit?: number;
  status?: "all" | "unread" | "read";
};

export function useGetWebNotifications(params: GetNotificationsParams, enabled = true) {
  return useQuery({
    queryKey: [...API_CACHE_KEYS.NOTIFICATIONS, params],
    enabled,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const search = new URLSearchParams();
      search.set("page", String(params.page || 1));
      search.set("limit", String(params.limit || 20));
      search.set("status", params.status || "all");
      const res = await apiClient.get<WebNotificationsResponse>(
        `${NOTIFICATION_ENDPOINTS.LIST}?${search.toString()}`,
      );
      return res.data;
    },
  });
}
