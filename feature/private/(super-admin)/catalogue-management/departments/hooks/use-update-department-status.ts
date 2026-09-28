import { useApiMutation } from "@/hooks/useApi";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateDepartmentStatus(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<{ status: string }, any>(
    "patch",
    CATALOGUE_MANAGEMENT_ENDPOINTS.UPDATE_DEPARTMENT_STATUS(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["departments"] });
        queryClient.invalidateQueries({ queryKey: ["department", id] });
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to update status");
      },
    },
  );
}
