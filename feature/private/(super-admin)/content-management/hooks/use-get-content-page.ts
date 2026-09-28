import { useApiQuery } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { CONTENT_PAGES_ENDPOINTS } from "@/lib/api/endpoints/content-pages.endpoints";
import type { ContentPageData, ContentPageKey } from "../types";

type ContentPageResponse = {
  message: string;
  data: ContentPageData;
};

export function useGetContentPage(pageKey: ContentPageKey) {
  return useApiQuery<ContentPageResponse>(
    API_CACHE_KEYS.CONTENT_PAGE(pageKey),
    CONTENT_PAGES_ENDPOINTS.ADMIN_GET(pageKey),
  );
}
