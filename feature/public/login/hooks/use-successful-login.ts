import { AdminProfile } from "@/components/providers/profile-provider";
import { successToast } from "@/components/toaster";
import { ROUTE_PERMISSION_MAP } from "@/config/permissions";
import { ROUTES } from "@/config/routes";
import { fetcher } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { AUTH_ENDPOINTS } from "@/lib/api/endpoints/auth.endpoints";
import { setAuthSession } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useSuccessfulLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSuccessfulLogin = async (accessToken: string, successMessage: string) => {
    setAuthSession({
      accessToken,
    });

    let targetRoute: string = ROUTES.ADMIN.DASHBOARD;
    try {
      const profile = await fetcher<AdminProfile>({
        method: "get",
        url: AUTH_ENDPOINTS.PROFILE,
      });
      queryClient.setQueryData(API_CACHE_KEYS.ADMIN_PROFILE, profile);

      const isSuperAdmin = profile.roleCode === "SUPER_ADMIN" || profile.role === "super_admin";

      if (!isSuperAdmin && profile.permissions) {
        if (profile.permissions["dashboard"] !== 1) {
          const firstAccessible = Object.entries(ROUTE_PERMISSION_MAP).find(
            ([, permKey]) => profile.permissions[permKey] === 1,
          );
          if (firstAccessible) {
            targetRoute = firstAccessible[0];
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile for redirect", error);
    }

    successToast({
      title: "",
      description: successMessage,
    });
    router.refresh();
    router.push(targetRoute);
  };

  return { handleSuccessfulLogin };
};
