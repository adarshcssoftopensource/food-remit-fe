import { successToast } from "@/components/toaster";
import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { EMPLOYEE_ENDPOINTS } from "@/lib/api/endpoints/employee.endpoints";
import { useQueryClient } from "@tanstack/react-query";

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useApiMutation<any, FormData>("post", EMPLOYEE_ENDPOINTS.CREATE_EMPLOYEE, {
    onSuccess: (res) => {
      successToast({ description: res?.message || "Employee created successfully" });
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.EMPLOYEES });
    },
  });
}
