import { useMutation, useQueryClient } from "@tanstack/react-query";

import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { CONTENT_PAGES_ENDPOINTS } from "@/lib/api/endpoints/content-pages.endpoints";
import type { ContentPageFormValues } from "../schema/content.schema";
import type { ContentPageData, ContentPageKey } from "../types";

type UpdateResponse = {
  message: string;
  data: ContentPageData;
};

export function useUpdateContentPage(pageKey: ContentPageKey) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ContentPageFormValues) => {
      const { data } = await apiClient.put<UpdateResponse>(
        CONTENT_PAGES_ENDPOINTS.ADMIN_UPDATE(pageKey),
        values,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.CONTENT_PAGE(pageKey) });
    },
  });
}
