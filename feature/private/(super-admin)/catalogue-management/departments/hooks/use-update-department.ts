import { useApiMutation } from "@/hooks/useApi";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { useQueryClient } from "@tanstack/react-query";
import type { UpdateDepartmentPayload } from "../types/department.types";

export function useUpdateDepartment(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<UpdateDepartmentPayload, any>(
    "patch",
    CATALOGUE_MANAGEMENT_ENDPOINTS.UPDATE_DEPARTMENT(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["departments"] });
        queryClient.invalidateQueries({ queryKey: ["department", id] });
      },
    },
  );
}
