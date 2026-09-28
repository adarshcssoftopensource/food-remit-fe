import { useApiMutation } from "@/hooks/useApi";
import { FLASH_IMAGES_ENDPOINTS } from "@/lib/api/endpoints/flash-images.endpoints";

export function useUpdateFlashImage(id: string) {
  return useApiMutation("put", FLASH_IMAGES_ENDPOINTS.UPDATE(id));
}
