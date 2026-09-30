import { useApiMutation } from "@/hooks/useApi";
import { STORE_MANAGER_ENDPOINTS } from "@/lib/api/endpoints/store-manager.endpoints";
import { STORE_ENDPOINTS } from "@/lib/api/endpoints/store.endpoints";
import {
  CreateStoreManagerPayload,
  CreateStoreManagerResponse,
  CreateStorePayload,
  CreateStoreResponse,
} from "../types/store-management";

import { useQueryClient } from "@tanstack/react-query";

export function useUpdateStoreManager(id: string) {
  const queryClient = useQueryClient();
  return useApiMutation<CreateStoreManagerResponse, Partial<CreateStoreManagerPayload>>(
    "patch",
    STORE_MANAGER_ENDPOINTS.UPDATE_STORE_MANAGER(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["store-managers"] });
        queryClient.invalidateQueries({ queryKey: ["store-manager", id] });
      },
    },
  );
}

export function useUpdateStore(id: string) {
  const queryClient = useQueryClient();
  return useApiMutation<CreateStoreResponse, Partial<CreateStorePayload>>(
    "patch",
    STORE_ENDPOINTS.UPDATE_STORE(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["stores"] });
        queryClient.invalidateQueries({ queryKey: ["store", id] });
        queryClient.invalidateQueries({ queryKey: ["store-dashboard"] });
      },
    },
  );
}
