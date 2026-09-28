import { useApiQuery } from "@/hooks/useApi";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { useMemo } from "react";
import type { CategoryData } from "../types/category.types";

interface GetCategoryResponse {
  status: boolean;
  message: string;
  data: CategoryData;
}

export function useGetCategory(id: string) {
  const query = useApiQuery<GetCategoryResponse>(
    ["category", id],
    CATALOGUE_MANAGEMENT_ENDPOINTS.GET_CATEGORY(id),
    {
      enabled: !!id,
    },
  );

  const data = useMemo<CategoryData | undefined>(() => {
    return query.data?.data;
  }, [query.data]);

  return { ...query, data };
}
