import { useApiMutation } from "@/hooks/useApi";
import { FLASH_IMAGES_ENDPOINTS } from "@/lib/api/endpoints/flash-images.endpoints";

export function useCreateFlashImage() {
  return useApiMutation("post", FLASH_IMAGES_ENDPOINTS.CREATE);
}
