import { useApiQuery } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { SUB_ADMIN_ENDPOINTS } from "@/lib/api/endpoints/sub-admin.endpoints";
import { type GetSubAdminPermissionsResponse } from "../types/sub-admin.types";

export function useSubAdminPermissions(enabled: boolean) {
  return useApiQuery<GetSubAdminPermissionsResponse>(
    API_CACHE_KEYS.SUB_ADMIN_PERMISSIONS,
    SUB_ADMIN_ENDPOINTS.GET_PERMISSIONS,
    { enabled },
  );
}
