import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { SETTINGS_ENDPOINTS } from "@/lib/api/endpoints/settings.endpoints";
import { useQueryClient } from "@tanstack/react-query";
import type { CreateCountryPayload, CreateCountryResponse } from "../types/settings.types";

export function useCreateCountry() {
  const queryClient = useQueryClient();

  return useApiMutation<CreateCountryResponse, CreateCountryPayload>(
    "post",
    SETTINGS_ENDPOINTS.CREATE_COUNTRY,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: API_CACHE_KEYS.SETTINGS_COUNTRIES,
        });
      },
    },
  );
}
