import { useApiMutation } from "@/hooks/useApi";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { useQueryClient } from "@tanstack/react-query";

export function useUpdateItem(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<any, FormData>(
    "patch",
    `${CATALOGUE_MANAGEMENT_ENDPOINTS.GET_ITEMS}/${id}`,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["items"] });
      },
    },
  );
}
