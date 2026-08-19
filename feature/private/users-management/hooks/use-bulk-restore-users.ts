import { useApiMutation } from "@/hooks/useApi";
import { USER_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/user-management.endpoints";
import { useQueryClient } from "@tanstack/react-query";

interface BulkRestoreResponse {
  message: string;
}

export function useBulkRestoreUsers() {
  const queryClient = useQueryClient();

  return useApiMutation<BulkRestoreResponse, { ids: string[] }>(
    "post",
    USER_MANAGEMENT_ENDPOINTS.BULK_RESTORE_USERS(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["RECYCLED_USERS"] });
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    },
  );
}
