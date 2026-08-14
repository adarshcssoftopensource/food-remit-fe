import { useApiMutation } from "@/hooks/useApi";
import { STORE_ENDPOINTS } from "@/lib/api/endpoints/store.endpoints";
import { STORE_MANAGER_ENDPOINTS } from "@/lib/api/endpoints/store-manager.endpoints";
import {
  CreateStorePayload,
  CreateStoreManagerPayload,
  CreateStoreResponse,
  CreateStoreManagerResponse,
} from "../types/store-management";

export function useUpdateStoreManager(id: string) {
  return useApiMutation<CreateStoreManagerResponse, Partial<CreateStoreManagerPayload>>(
    "patch",
    STORE_MANAGER_ENDPOINTS.UPDATE_STORE_MANAGER(id),
  );
}

export function useUpdateStore(id: string) {
  return useApiMutation<CreateStoreResponse, Partial<CreateStorePayload>>(
    "patch",
    STORE_ENDPOINTS.UPDATE_STORE(id),
  );
}
