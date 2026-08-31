import { useApiMutation } from "@/hooks/useApi";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";

export function useBulkUploadItemImages() {
  return useApiMutation<string[], FormData>(
    "post",
    CATALOGUE_MANAGEMENT_ENDPOINTS.BULK_UPLOAD_ITEM_IMAGES,
  );
}
