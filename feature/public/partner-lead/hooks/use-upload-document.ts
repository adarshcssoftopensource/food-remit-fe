import { useApiMutation } from "@/hooks/useApi";
import { UPLOAD_ENDPOINTS } from "@/lib/api/endpoints/upload.endpoints";

export interface UploadFileInput {
  file: string;
  folder?: string;
  fileName?: string;
}

export interface UploadFileResponse {
  message: string;
  data: {
    path: string;
    url: string;
    fileName: string;
    mimeType: string;
    size: number;
  };
}

export function useUploadDocument() {
  return useApiMutation<UploadFileResponse, UploadFileInput>("post", UPLOAD_ENDPOINTS.UPLOAD, {});
}
