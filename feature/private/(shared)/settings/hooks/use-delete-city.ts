import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { SETTINGS_ENDPOINTS } from "@/lib/api/endpoints/settings.endpoints";
import { useQueryClient } from "@tanstack/react-query";
import type { DeleteCityResponse } from "../types/settings.types";

export function useDeleteCity(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<DeleteCityResponse, void>("delete", SETTINGS_ENDPOINTS.DELETE_CITY(id), {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: API_CACHE_KEYS.SETTINGS_CITIES,
      });
      queryClient.invalidateQueries({
        queryKey: API_CACHE_KEYS.SETTINGS_COUNTRIES,
      });
    },
  });
}
