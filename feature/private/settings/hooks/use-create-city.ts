import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { SETTINGS_ENDPOINTS } from "@/lib/api/endpoints/settings.endpoints";
import { useQueryClient } from "@tanstack/react-query";
import type { CreateCityPayload, CreateCityResponse } from "../types/settings.types";

export function useCreateCity() {
  const queryClient = useQueryClient();

  return useApiMutation<CreateCityResponse, CreateCityPayload>(
    "post",
    SETTINGS_ENDPOINTS.CREATE_CITY,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: API_CACHE_KEYS.SETTINGS_CITIES,
        });
        queryClient.invalidateQueries({
          queryKey: API_CACHE_KEYS.SETTINGS_COUNTRIES,
        });
      },
    },
  );
}
