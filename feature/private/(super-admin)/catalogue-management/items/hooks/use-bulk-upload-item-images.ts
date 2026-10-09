import axiosInstance from "@/lib/api/client";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { useMutation } from "@tanstack/react-query";

export type BulkImageStatus = "uploaded" | "skipped" | "failed";

export type BulkImageResult = {
  originalName: string;
  source: string | null;
  status: BulkImageStatus;
  fileName?: string;
  url?: string;
  reason?: string;
};

export type BulkImageUploadResponse = {
  message?: string;
  data?: {
    uploadedCount: number;
    skippedCount: number;
    failedCount: number;
    results: BulkImageResult[];
  };
};

type UploadVariables = {
  files: File[];
  onProgress?: (percent: number) => void;
};

/** Uploads images and ZIP archives; the page shows a per-file report. */
export function useBulkUploadItemImages() {
  return useMutation<BulkImageUploadResponse, Error, UploadVariables>({
    mutationFn: async ({ files, onProgress }) => {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      const response = await axiosInstance.post(
        CATALOGUE_MANAGEMENT_ENDPOINTS.BULK_UPLOAD_ITEM_IMAGES,
        formData,
        {
          timeout: 10 * 60 * 1000,
          onUploadProgress: (event) => {
            if (event.total) onProgress?.(Math.round((event.loaded / event.total) * 100));
          },
        },
      );
      return response.data as BulkImageUploadResponse;
    },
  });
}
