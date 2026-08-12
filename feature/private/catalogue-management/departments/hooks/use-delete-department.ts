import { useApiMutation } from "@/hooks/useApi";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { useQueryClient } from "@tanstack/react-query";

export function useDeleteDepartment(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<void, any>("delete", CATALOGUE_MANAGEMENT_ENDPOINTS.DELETE_DEPARTMENT(id), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}
