import { useApiMutation } from "@/hooks/useApi";
import { USER_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/user-management.endpoints";
import { useQueryClient } from "@tanstack/react-query";

interface RestoreUserResponse {
  message: string;
}

export function useRestoreUser() {
  const queryClient = useQueryClient();

  return useApiMutation<RestoreUserResponse, { id: string }>(
    "post",
    (payload) => USER_MANAGEMENT_ENDPOINTS.RESTORE_USER(payload.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["RECYCLED_USERS"] });
      },
    },
  );
}
