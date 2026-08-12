import { useApiMutation } from "@/hooks/useApi";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { useQueryClient } from "@tanstack/react-query";
import type { CreateDepartmentPayload } from "../types/department.types";

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useApiMutation<CreateDepartmentPayload, any>(
    "post",
    CATALOGUE_MANAGEMENT_ENDPOINTS.CREATE_DEPARTMENT,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["departments"] });
      },
    },
  );
}
