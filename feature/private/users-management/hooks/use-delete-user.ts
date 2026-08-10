import { useApiMutation } from "@/hooks/useApi";
import { USER_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/user-management.endpoints";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteUserArgs {
  userId: string;
}

interface DeleteUserResponse {
  message: string;
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useApiMutation<DeleteUserResponse, DeleteUserArgs>(
    "post",
    USER_MANAGEMENT_ENDPOINTS.DELETE_USER,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    },
  );
}
