import { useApiMutation } from "@/hooks/useApi";
import { STORE_ENDPOINTS } from "@/lib/api/endpoints/store.endpoints";
import { STORE_MANAGER_ENDPOINTS } from "@/lib/api/endpoints/store-manager.endpoints";
import {
  CreateStoreManagerPayload,
  CreateStoreManagerResponse,
  CreateStorePayload,
  CreateStoreResponse,
} from "../types/store-management";

export function useCreateStoreManager() {
  return useApiMutation<CreateStoreManagerResponse, CreateStoreManagerPayload>(
    "post",
    STORE_MANAGER_ENDPOINTS.CREATE_STORE_MANAGER,
  );
}

export function useCreateStore() {
  return useApiMutation<CreateStoreResponse, CreateStorePayload>(
    "post",
    STORE_ENDPOINTS.CREATE_STORE,
  );
}
