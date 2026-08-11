import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { SETTINGS_ENDPOINTS } from "@/lib/api/endpoints/settings.endpoints";
import { useQueryClient } from "@tanstack/react-query";
import type { UpdateCountryPayload, UpdateCountryResponse } from "../types/settings.types";

export function useUpdateCountry(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<UpdateCountryResponse, UpdateCountryPayload>(
    "patch",
    SETTINGS_ENDPOINTS.UPDATE_COUNTRY(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: API_CACHE_KEYS.SETTINGS_COUNTRIES,
        });
      },
    },
  );
}
