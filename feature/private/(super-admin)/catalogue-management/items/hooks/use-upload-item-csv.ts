import axiosInstance from "@/lib/api/client";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";

export type ItemCsvImportData = {
  successCount?: number;
  createdCount?: number;
  updatedCount?: number;
  optionsCount?: number;
  imagesDownloaded?: number;
  errorCount?: number;
  categoriesCreated?: number;
  errors?: string[];
  warnings?: string[];
};

export type ItemCsvUploadResult = {
  message?: string;
  data?: ItemCsvImportData;
};

export type ItemCsvErrorPayload = {
  message?: string | string[];
  errors?: string[];
  data?: ItemCsvImportData;
};

/**
 * Upload CSV / Excel with the global error toast suppressed so the UI can show
 * a detailed result dialog. `categoryId` imports rows without a category name
 * into that category.
 */
export async function uploadItemCsvFile(
  file: File,
  categoryId?: string,
): Promise<ItemCsvUploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  if (categoryId) formData.append("categoryId", categoryId);

  const response = await axiosInstance.post(
    CATALOGUE_MANAGEMENT_ENDPOINTS.UPLOAD_ITEM_CSV,
    formData,
    {
      // Image links in the file are downloaded during the import.
      timeout: 10 * 60 * 1000,
      skipErrorToast: true,
    } as Parameters<typeof axiosInstance.post>[2],
  );

  return response.data as ItemCsvUploadResult;
}
