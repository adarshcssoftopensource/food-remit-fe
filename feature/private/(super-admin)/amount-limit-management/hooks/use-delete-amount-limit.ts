import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { AMOUNT_LIMIT_ENDPOINTS } from "@/lib/api/endpoints/amount-limit.endpoints";
import { useQueryClient } from "@tanstack/react-query";

export function useDeleteAmountLimit() {
  const queryClient = useQueryClient();

  return useApiMutation<{ message: string }, string>(
    "delete",
    (id: string) => AMOUNT_LIMIT_ENDPOINTS.DELETE_AMOUNT_LIMIT(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.AMOUNT_LIMITS });
      },
    },
  );
}
