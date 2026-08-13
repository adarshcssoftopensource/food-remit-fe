import { useRouter } from "next/navigation";
import { useApiMutation } from "@/hooks/useApi";
import { AUTH_ENDPOINTS } from "@/lib/api/endpoints/auth.endpoints";
import { clearAuthSession } from "@/lib/auth-client";
import { ROUTES } from "@/config/routes";
import { successToast } from "@/components/toaster";

export function useLogout() {
  const router = useRouter();
  const { mutateAsync, isPending } = useApiMutation("post", AUTH_ENDPOINTS.LOGOUT);

  const handleLogout = async () => {
    try {
      await mutateAsync({});
      clearAuthSession();
      router.push(ROUTES.AUTH.LOGIN);
      router.refresh();
      successToast({
        description: "Session logout successfully",
      });
    } catch {}
  };

  return { handleLogout, isPending };
}
