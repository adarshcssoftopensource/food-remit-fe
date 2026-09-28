import { fetcher } from "@/hooks/useApi";
import { AUTH_ENDPOINTS, type AuthTokenResponse } from "@/lib/api/endpoints/auth.endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setAuthSession, buildCookieOptions } from "@/lib/auth-client";
import { AUTH_TOKEN_COOKIE, ORIGINAL_AUTH_TOKEN_COOKIE } from "@/config/cookie";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";

export function useImpersonateStore() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (storeId: string) => {
      const response = await fetcher<AuthTokenResponse>({
        method: "post",
        url: `${AUTH_ENDPOINTS.IMPERSONATE}/${storeId}`,
      });
      return response;
    },
    onSuccess: (data) => {
      if (data?.access_token) {
        const currentToken = Cookies.get(AUTH_TOKEN_COOKIE);
        if (currentToken) {
          Cookies.set(ORIGINAL_AUTH_TOKEN_COOKIE, currentToken, buildCookieOptions());
        }

        setAuthSession({ accessToken: data.access_token });

        // Clear all cached data (like stores, queries) to prevent data leakage between sessions.
        // This will force the ProfileProvider to unmount children and refetch the profile.
        queryClient.clear();
        router.push(ROUTES.ADMIN.DASHBOARD);
      }
    },
  });
}
