import axiosInstance from "@/lib/api/client";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import type { AxiosRequestConfig } from "axios";

export const CATEGORY_PICKER_PAGE_SIZE = 30;

export interface CategoryPickerItem {
  id: string;
  categoryName: string;
  categoryIconUrl: string | null;
  status: "ACTIVE" | "INACTIVE";
  storeName: string | null;
  itemCount: number;
}

interface CategoryPickerPage {
  items: CategoryPickerItem[];
  nextCursor: string | null;
}

/**
 * Cursor-paginated category search. Pages are fetched on demand while
 * scrolling and superseded searches are aborted, so the picker stays fast no
 * matter how many categories exist.
 */
export function useCategoryPicker(search: string, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: [...API_CACHE_KEYS.CATEGORIES, "picker", search],
    queryFn: async ({ pageParam, signal }) => {
      const response = await axiosInstance.get<{ data: CategoryPickerPage }>(
        CATALOGUE_MANAGEMENT_ENDPOINTS.CATEGORY_PICKER,
        {
          params: {
            search: search || undefined,
            cursor: pageParam ?? undefined,
            limit: CATEGORY_PICKER_PAGE_SIZE,
          },
          signal,
          skipErrorToast: true,
        } as AxiosRequestConfig,
      );
      return response.data.data;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    enabled,
  });
}
