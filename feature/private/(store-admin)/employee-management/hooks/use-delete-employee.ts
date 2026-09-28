import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EMPLOYEE_ENDPOINTS } from "@/lib/api/endpoints/employee.endpoints";
import axiosInstance from "@/lib/api/client";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";

export function useDeleteEmployee(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.delete(EMPLOYEE_ENDPOINTS.DELETE_EMPLOYEE(id));
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.EMPLOYEES });
      toast.success(data?.message || "Employee deleted successfully");
    },
  });
}
