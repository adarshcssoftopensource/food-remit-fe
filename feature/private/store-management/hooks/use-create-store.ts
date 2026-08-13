import { useApiMutation } from "@/hooks/useApi";
import { STORE_ENDPOINTS } from "@/lib/api/endpoints/store.endpoints";
import { STORE_MANAGER_ENDPOINTS } from "@/lib/api/endpoints/store-manager.endpoints";

// ── Payload types ─────────────────────────────────────────────────────────────

export interface CreateStoreManagerPayload {
  firstName: string;
  lastName: string;
  email: string;
  countryCode?: string;
  phoneNumber?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  managerStatus?: string;
}

export interface CreateStorePayload {
  storeName: string;
  storeCountryCode?: string;
  storePhoneNumber?: string;
  storeAddress?: string;
  storeAddress2?: string;
  country?: string;
  city?: string;
  storeTax?: number;
  foodRemitCommission?: number;
  status?: string;
  assignedStoreManager?: string;
}

// ── Response types ────────────────────────────────────────────────────────────

export interface CreateStoreManagerResponse {
  message: string;
  status: boolean;
  data: { id: string; [key: string]: unknown };
}

export interface CreateStoreResponse {
  message: string;
  status: boolean;
  data: { id: string; [key: string]: unknown };
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

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
