import { useApiMutation } from "@/hooks/useApi";
import { USER_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/user-management.endpoints";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateUserStatusArgs {
  userId: string;
  status: "ACTIVE" | "INACTIVE";
}

interface UpdateUserStatusResponse {
  message: string;
  data?: {
    id: string;
    userStatus: string;
  };
}

export function useUpdateUserStatus(userId: string) {
  const queryClient = useQueryClient();

  return useApiMutation<UpdateUserStatusResponse, Omit<UpdateUserStatusArgs, "userId">>(
    "patch",
    USER_MANAGEMENT_ENDPOINTS.UPDATE_USER_STATUS(userId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    },
  );
}
