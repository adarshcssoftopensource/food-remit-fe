import { useMutation, useQueryClient } from "@tanstack/react-query";

import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { LANDING_PAGE_ENDPOINTS } from "@/lib/api/endpoints/landing-page.endpoints";
import type { LandingSectionKey } from "../types";

type UpdateArgs = {
  section: LandingSectionKey;
  data: unknown;
  image?: File | null;
};

type UpdateLandingSectionResponse = {
  message: string;
};

export function useUpdateLandingSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ section, data, image }: UpdateArgs) => {
      const formData = new FormData();
      const payload =
        data && typeof data === "object" && !Array.isArray(data)
          ? (data as Record<string, unknown>)
          : {};

      if (Object.keys(payload).length > 0) {
        formData.append("data", JSON.stringify(payload));
      }
      if (image) formData.append("image", image);

      const { data: response } = await apiClient.put<UpdateLandingSectionResponse>(
        LANDING_PAGE_ENDPOINTS.ADMIN_UPDATE_SECTION(section),
        formData,
        { headers: { "Content-Type": "multipart/form-data" }, timeout: 120000 },
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.LANDING_PAGE });
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.LANDING_PAGE_PUBLIC });
    },
  });
}
