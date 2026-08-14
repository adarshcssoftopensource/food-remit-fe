import { useApiMutation } from "@/hooks/useApi";
import { CITY_MANAGER_ENDPOINTS } from "@/lib/api/endpoints/city-manager.endpoints";
import type {
  CityManagerMutationResponse,
  CityManagerPayload,
  UpdateCityManagerPayload,
} from "../types/city-manager";

export function useCreateCityManager() {
  return useApiMutation<CityManagerMutationResponse, CityManagerPayload | FormData>(
    "post",
    CITY_MANAGER_ENDPOINTS.CREATE_CITY_MANAGER,
  );
}

export function useUpdateCityManager(id?: string) {
  return useApiMutation<CityManagerMutationResponse, UpdateCityManagerPayload | FormData>(
    "patch",
    (payload) => {
      // If id is not provided in args, extract from payload
      const finalId =
        id || (payload instanceof FormData ? (payload.get("id") as string) : payload.id);
      return CITY_MANAGER_ENDPOINTS.UPDATE_CITY_MANAGER(finalId);
    },
  );
}
