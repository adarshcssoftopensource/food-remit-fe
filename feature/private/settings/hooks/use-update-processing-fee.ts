import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { SETTINGS_ENDPOINTS } from "@/lib/api/endpoints/settings.endpoints";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateProcessingFeePayload {
  processingFee: string;
}

interface UpdateProcessingFeeResponse {
  message: string;
  status: boolean;
  data: {
    id: string;
    countryName: string;
    processingFee: string;
  };
}

export function useUpdateProcessingFee(countryId: string) {
  const queryClient = useQueryClient();

  return useApiMutation<UpdateProcessingFeeResponse, UpdateProcessingFeePayload>(
    "patch",
    SETTINGS_ENDPOINTS.UPDATE_PROCESSING_FEE(countryId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: API_CACHE_KEYS.SETTINGS_PROCESSING_FEES,
        });
      },
    },
  );
}
