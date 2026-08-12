import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { ItemData } from "../types/item.types";
import { useApiQuery } from "@/hooks/useApi";

interface GetItemByIdResponse {
  message: string;
  data: ItemData;
}

export function useGetItemById(id: string) {
  return useApiQuery<GetItemByIdResponse>(
    ["item", id],
    CATALOGUE_MANAGEMENT_ENDPOINTS.GET_ITEM(id),
    {
      enabled: !!id,
    },
  );
}
