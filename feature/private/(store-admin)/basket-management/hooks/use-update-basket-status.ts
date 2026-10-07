import { useQueryClient } from "@tanstack/react-query";

import { successToast } from "@/components/toaster";
import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { BASKET_ENDPOINTS } from "@/lib/api/endpoints/basket.endpoints";

interface UpdateStatusBody {
  id: string;
  status: "ACTIVE" | "INACTIVE";
}

export function useUpdateBasketStatus() {
  const queryClient = useQueryClient();
  return useApiMutation<{ message: string }, UpdateStatusBody>(
    "patch",
    (body) => BASKET_ENDPOINTS.UPDATE_STATUS(body.id),
    {
      onSuccess: (res) => {
        successToast({ description: res.message });
        void queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.BASKETS });
      },
    },
  );
}
