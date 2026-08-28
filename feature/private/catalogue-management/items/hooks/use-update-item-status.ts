import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { useQueryClient } from "@tanstack/react-query";
import { ItemStatus } from "../types/item.types";

export interface UpdateItemStatusPayload {
  type: "STATUS" | "ADMIN_SHARE" | "DISCOUNT_AVAILABILITY";
  status?: ItemStatus;
  adminShare?: boolean;
  discountAvailability?: boolean;
}

export function useUpdateItemStatus(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<any, UpdateItemStatusPayload>(
    "patch",
    `${CATALOGUE_MANAGEMENT_ENDPOINTS.GET_ITEMS}/${id}/status`,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.ITEMS });
      },
    },
  );
}
