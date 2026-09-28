import { successToast } from "@/components/toaster";
import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { EMPLOYEE_ENDPOINTS } from "@/lib/api/endpoints/employee.endpoints";
import { useQueryClient } from "@tanstack/react-query";

export function useUpdateEmployee(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<any, FormData>("put", EMPLOYEE_ENDPOINTS.UPDATE_EMPLOYEE(id), {
    onSuccess: (res) => {
      successToast({ description: res?.message || "Employee updated successfully" });
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.EMPLOYEES });
    },
  });
}
