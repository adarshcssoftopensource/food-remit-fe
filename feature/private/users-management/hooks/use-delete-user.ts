import { useApiMutation } from "@/hooks/useApi";
import { USER_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/user-management.endpoints";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteUserResponse {
  message: string;
}

export function useDeleteUser(userId: string) {
  const queryClient = useQueryClient();

  return useApiMutation<DeleteUserResponse, void>(
    "delete",
    USER_MANAGEMENT_ENDPOINTS.DELETE_USER(userId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    },
  );
}
