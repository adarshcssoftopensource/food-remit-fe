import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { SETTINGS_ENDPOINTS } from "@/lib/api/endpoints/settings.endpoints";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateAutoAbandonPayload {
  autoAbandonDays: number;
  autoAbandonRemark: string;
}

interface UpdateAutoAbandonResponse {
  message: string;
  status: boolean;
  data: {
    autoAbandonDays: number;
    autoAbandonRemark: string;
  };
}

export function useUpdateAutoAbandon() {
  const queryClient = useQueryClient();

  return useApiMutation<UpdateAutoAbandonResponse, UpdateAutoAbandonPayload>(
    "post",
    SETTINGS_ENDPOINTS.UPDATE_AUTO_ABANDON,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.SETTINGS_AUTO_ABANDON });
      },
    },
  );
}
