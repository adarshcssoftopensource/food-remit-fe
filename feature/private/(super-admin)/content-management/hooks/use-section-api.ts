import { useMutation, useQueryClient } from "@tanstack/react-query";

import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { CONTENT_PAGES_ENDPOINTS } from "@/lib/api/endpoints/content-pages.endpoints";
import type { ContentPageData, ContentPageKey, ContentPageSection } from "../types";

type SectionResponse = {
  message: string;
  data: ContentPageData;
};

export function useAddSection(pageKey: ContentPageKey) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (section: Partial<ContentPageSection>) => {
      const { data } = await apiClient.post<SectionResponse>(
        CONTENT_PAGES_ENDPOINTS.ADMIN_ADD_SECTION(pageKey),
        section,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.CONTENT_PAGE(pageKey) });
    },
  });
}

export function useEditSection(pageKey: ContentPageKey) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sectionId,
      section,
    }: {
      sectionId: string;
      section: Partial<ContentPageSection>;
    }) => {
      const { data } = await apiClient.put<SectionResponse>(
        CONTENT_PAGES_ENDPOINTS.ADMIN_UPDATE_SECTION(pageKey, sectionId),
        section,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.CONTENT_PAGE(pageKey) });
    },
  });
}

export function useDeleteSection(pageKey: ContentPageKey) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sectionId: string) => {
      const { data } = await apiClient.delete<SectionResponse>(
        CONTENT_PAGES_ENDPOINTS.ADMIN_DELETE_SECTION(pageKey, sectionId),
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.CONTENT_PAGE(pageKey) });
    },
  });
}
