import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { SETTINGS_ENDPOINTS } from "@/lib/api/endpoints/settings.endpoints";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateMarkupPayload {
  markupPercentage: string;
}

interface UpdateMarkupResponse {
  message: string;
  status: boolean;
  data: {
    markupPercentage: string;
  };
}

export function useUpdateMarkup() {
  const queryClient = useQueryClient();

  return useApiMutation<UpdateMarkupResponse, UpdateMarkupPayload>(
    "post",
    SETTINGS_ENDPOINTS.UPDATE_MARKUP,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.SETTINGS_MARKUP });
      },
    },
  );
}
