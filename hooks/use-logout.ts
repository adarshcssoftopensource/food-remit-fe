import { successToast } from "@/components/toaster";
import { ROUTES } from "@/config/routes";
import { useApiMutation } from "@/hooks/useApi";
import { AUTH_ENDPOINTS } from "@/lib/api/endpoints/auth.endpoints";
import { clearAuthSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

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
