import { successToast } from "@/components/toaster";
import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { EMPLOYEE_ENDPOINTS } from "@/lib/api/endpoints/employee.endpoints";
import { useQueryClient } from "@tanstack/react-query";

export function useUpdateEmployeeStatus() {
  const queryClient = useQueryClient();

  return useApiMutation<any, { id: string; status: "ACTIVE" | "INACTIVE" }>(
    "patch",
    (body) => EMPLOYEE_ENDPOINTS.UPDATE_STATUS(body.id),
    {
      onSuccess: (res) => {
        successToast({ description: res?.message || "Status updated successfully" });
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.EMPLOYEES });
      },
    },
  );
}
