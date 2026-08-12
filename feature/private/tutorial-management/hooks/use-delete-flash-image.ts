import { useApiMutation } from "@/hooks/useApi";
import { FLASH_IMAGES_ENDPOINTS } from "@/lib/api/endpoints/flash-images.endpoints";

export function useDeleteFlashImage(id: string) {
  return useApiMutation("delete", FLASH_IMAGES_ENDPOINTS.DELETE(id));
}
