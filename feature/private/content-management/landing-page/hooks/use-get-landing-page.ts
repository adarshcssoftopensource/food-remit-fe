import { useApiQuery } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { LANDING_PAGE_ENDPOINTS } from "@/lib/api/endpoints/landing-page.endpoints";
import type { LandingPageResponse } from "../types";

export function useGetLandingPage(admin = true) {
  return useApiQuery<LandingPageResponse>(
    admin ? API_CACHE_KEYS.LANDING_PAGE : API_CACHE_KEYS.LANDING_PAGE_PUBLIC,
    admin ? LANDING_PAGE_ENDPOINTS.ADMIN_GET : LANDING_PAGE_ENDPOINTS.PUBLIC_GET,
  );
}
