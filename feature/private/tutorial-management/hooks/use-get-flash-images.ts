import { useApiQuery } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { FLASH_IMAGES_ENDPOINTS } from "@/lib/api/endpoints/flash-images.endpoints";

export interface FlashImageData {
  id: string;
  title: string | null;
  description: string | null;
  imageUrl: string;
  isActive: boolean;
}

interface GetFlashImagesResponse {
  message: string;
  data: FlashImageData[];
}

export function useGetFlashImages() {
  return useApiQuery<GetFlashImagesResponse>(
    API_CACHE_KEYS.FLASH_IMAGES,
    FLASH_IMAGES_ENDPOINTS.GET_ALL,
    {},
  );
}
