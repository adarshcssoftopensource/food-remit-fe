import { useApiMutation } from "@/hooks/useApi";
import { SUB_ADMIN_ENDPOINTS } from "@/lib/api/endpoints/sub-admin.endpoints";
import { CreateSubAdminPayload, CreateSubAdminResponse } from "../types/sub-admin.types";

export function useCreateSubAdmin() {
  return useApiMutation<CreateSubAdminResponse, CreateSubAdminPayload>(
    "post",
    SUB_ADMIN_ENDPOINTS.CREATE_SUB_ADMIN,
  );
}
