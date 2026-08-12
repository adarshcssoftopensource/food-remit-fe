import { useApiMutation } from "@/hooks/useApi";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { useQueryClient } from "@tanstack/react-query";

export function useDeleteItem(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<any, void>("delete", `${CATALOGUE_MANAGEMENT_ENDPOINTS.GET_ITEMS}/${id}`, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
