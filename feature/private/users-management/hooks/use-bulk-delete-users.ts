import { useApiMutation } from "@/hooks/useApi";
import { USER_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/user-management.endpoints";
import { useQueryClient } from "@tanstack/react-query";

interface BulkDeleteResponse {
  message: string;
}

export function useBulkDeleteUsers() {
  const queryClient = useQueryClient();

  return useApiMutation<BulkDeleteResponse, { ids: string[] }>(
    "post",
    USER_MANAGEMENT_ENDPOINTS.BULK_DELETE_USERS(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    },
  );
}
