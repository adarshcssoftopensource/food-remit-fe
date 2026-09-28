import { useApiMutation } from "@/hooks/useApi";
import { COUNTRY_MANAGER_ENDPOINTS } from "@/lib/api/endpoints/country-manager.endpoints";
import type {
  CountryManagerMutationResponse,
  CountryManagerPayload,
  UpdateCountryManagerPayload,
} from "../types/country-manager";

export function useCreateCountryManager() {
  return useApiMutation<CountryManagerMutationResponse, CountryManagerPayload | FormData>(
    "post",
    COUNTRY_MANAGER_ENDPOINTS.CREATE_COUNTRY_MANAGER,
  );
}

export function useUpdateCountryManager(id?: string) {
  return useApiMutation<CountryManagerMutationResponse, UpdateCountryManagerPayload | FormData>(
    "patch",
    (payload) => {
      // If id is not provided in args, extract from payload
      const finalId =
        id || (payload instanceof FormData ? (payload.get("id") as string) : payload.id);
      return COUNTRY_MANAGER_ENDPOINTS.UPDATE_COUNTRY_MANAGER(finalId);
    },
  );
}
