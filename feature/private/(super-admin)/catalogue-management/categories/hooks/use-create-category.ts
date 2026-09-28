import { useApiMutation } from "@/hooks/useApi";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { useQueryClient } from "@tanstack/react-query";
import type { CreateCategoryPayload } from "../types/category.types";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useApiMutation<CreateCategoryPayload, any>(
    "post",
    CATALOGUE_MANAGEMENT_ENDPOINTS.CREATE_CATEGORY,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      },
    },
  );
}
