"use client";

import { useProfile } from "@/components/providers/profile-provider";
import { Button } from "@/components/ui/button";
import { clearAuthSession, setAuthSession, buildCookieOptions } from "@/lib/auth-client";
import { ORIGINAL_AUTH_TOKEN_COOKIE } from "@/config/cookie";
import Cookies from "js-cookie";
import { AlertCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export function ImpersonationBanner() {
  const { isReadOnly, profile } = useProfile();
  const router = useRouter();
  const queryClient = useQueryClient();

  if (!isReadOnly) return null;

  const handleExit = () => {
    const originalToken = Cookies.get(ORIGINAL_AUTH_TOKEN_COOKIE);
    if (originalToken) {
      setAuthSession({ accessToken: originalToken });
      Cookies.remove(ORIGINAL_AUTH_TOKEN_COOKIE, buildCookieOptions());
      queryClient.clear();
      router.push("/store-management");
    } else {
      clearAuthSession();
      queryClient.clear();
      router.push("/login");
    }
  };

  return (
    <div className="sticky top-0 z-50 flex w-full items-center justify-between bg-blue-600 px-4 py-2 text-white shadow-md">
      <div className="flex items-center gap-2">
        <AlertCircle className="size-5" />
        <span className="text-sm font-medium">
          You are currently impersonating <strong>{profile?.name}</strong>. You are in{" "}
          <strong>View Only</strong> mode.
        </span>
      </div>
      <Button
        variant="secondary"
        size="sm"
        className="h-8 border-0 bg-white/10 text-white hover:bg-white/20"
        onClick={handleExit}
      >
        <LogOut className="mr-2 size-4" />
        Return to Original Profile
      </Button>
    </div>
  );
}
