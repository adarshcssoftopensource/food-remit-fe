import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { AMOUNT_LIMIT_ENDPOINTS } from "@/lib/api/endpoints/amount-limit.endpoints";
import { useQueryClient } from "@tanstack/react-query";
import type {
  AmountLimitDetailResponse,
  CreateAmountLimitPayload,
} from "../types/amount-limit.types";

export function useCreateAmountLimit() {
  const queryClient = useQueryClient();

  return useApiMutation<AmountLimitDetailResponse, CreateAmountLimitPayload>(
    "post",
    AMOUNT_LIMIT_ENDPOINTS.CREATE_AMOUNT_LIMIT,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.AMOUNT_LIMITS });
      },
    },
  );
}
