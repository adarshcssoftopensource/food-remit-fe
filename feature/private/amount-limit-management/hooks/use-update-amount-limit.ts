import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { AMOUNT_LIMIT_ENDPOINTS } from "@/lib/api/endpoints/amount-limit.endpoints";
import { useQueryClient } from "@tanstack/react-query";
import type {
  AmountLimitDetailResponse,
  UpdateAmountLimitPayload,
} from "../types/amount-limit.types";

export function useUpdateAmountLimit(id?: string) {
  const queryClient = useQueryClient();

  return useApiMutation<AmountLimitDetailResponse, UpdateAmountLimitPayload>(
    "patch",
    (payload) => {
      const targetId = id || payload.id;
      if (!targetId) throw new Error("Amount limit ID is required for update");
      return AMOUNT_LIMIT_ENDPOINTS.UPDATE_AMOUNT_LIMIT(targetId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.AMOUNT_LIMITS });
      },
    },
  );
}
