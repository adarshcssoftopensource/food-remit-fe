import { useApiMutation } from "@/hooks/useApi";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { useQueryClient } from "@tanstack/react-query";
import type { UpdateCategoryPayload } from "../types/category.types";

export function useUpdateCategory(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<UpdateCategoryPayload, any>(
    "patch",
    CATALOGUE_MANAGEMENT_ENDPOINTS.UPDATE_CATEGORY(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        queryClient.invalidateQueries({ queryKey: ["category", id] });
      },
    },
  );
}
