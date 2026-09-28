import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/api/client";

export type ItemCsvUploadResult = {
  message?: string;
  data?: {
    successCount?: number;
    errorCount?: number;
    departmentsCreated?: number;
    categoriesCreated?: number;
    errors?: string[];
  };
};

export function useUploadItemCsv() {
  const queryClient = useQueryClient();

  return useApiMutation<ItemCsvUploadResult, FormData>(
    "post",
    CATALOGUE_MANAGEMENT_ENDPOINTS.UPLOAD_ITEM_CSV,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.ITEMS });
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.DEPARTMENTS });
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.CATEGORIES });
      },
    },
  );
}

/** Upload CSV with toast suppressed so the UI can show a detailed result dialog. */
export async function uploadItemCsvFile(file: File): Promise<ItemCsvUploadResult> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post(
    CATALOGUE_MANAGEMENT_ENDPOINTS.UPLOAD_ITEM_CSV,
    formData,
    {
      timeout: 120000,
      skipErrorToast: true,
    } as Parameters<typeof axiosInstance.post>[2],
  );

  return response.data as ItemCsvUploadResult;
}
