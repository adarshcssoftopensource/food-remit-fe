import { useMutation } from "@tanstack/react-query";

import apiClient from "@/lib/api/client";
import { BASKET_ENDPOINTS } from "@/lib/api/endpoints/basket.endpoints";

export function useUploadBasketImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      const res = await apiClient.post<{ data: { url: string } }>(
        BASKET_ENDPOINTS.UPLOAD_IMAGE,
        formData,
        { timeout: 60000 },
      );
      return res.data.data.url;
    },
  });
}
