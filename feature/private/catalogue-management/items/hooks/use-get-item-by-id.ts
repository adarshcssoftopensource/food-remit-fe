import { useApiQuery } from "@/hooks/useApi";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { findWorldCountryByIso } from "@/lib/world-locations";
import { ItemData } from "../types/item.types";

interface GetItemByIdResponse {
  message: string;
  data: ItemData;
}

export function useGetItemById(
  id: string,
  opts?: {
    countryId?: string;
    countryCode?: string | null;
    countryName?: string | null;
    enabled?: boolean;
  },
) {
  const countryId = opts?.countryId;
  const countryCode = opts?.countryCode || undefined;
  const countryName = opts?.countryName || undefined;
  const dialCode = countryCode ? findWorldCountryByIso(countryCode)?.phonecode : undefined;
  const enabled = opts?.enabled ?? true;

  return useApiQuery<GetItemByIdResponse>(
    ["item", id, countryId || "", countryCode || "", countryName || "", dialCode || ""],
    CATALOGUE_MANAGEMENT_ENDPOINTS.GET_ITEM(id, {
      countryId,
      countryCode,
      countryName,
      dialCode,
    }),
    {
      enabled: !!id && enabled,
    },
  );
}
