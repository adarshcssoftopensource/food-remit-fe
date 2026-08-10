"use client";

import { AccessDeniedScreen } from "@/components/access-denied-screen";
import { ProfileErrorScreen } from "@/components/profile-error-screen";
import { ProfileLoadingScreen } from "@/components/profile-loading-screen";
import { hasPathPermission } from "@/config/permissions";
import { ROUTES } from "@/config/routes";
import { fetcher } from "@/hooks/useApi";
import { AUTH_ENDPOINTS } from "@/lib/api/endpoints/auth.endpoints";
import { clearAuthSession } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useContext, useTransition } from "react";

export type ProfilePermissions = Record<string, number | null | undefined>;

export interface AdminProfile {
  name: string;
  email: string;
  role: string;
  roleCode: string;
  permissions: ProfilePermissions;
}

interface ProfileContextType {
  profile: AdminProfile | null;
  isLoading: boolean;
  isError: boolean;
  isSuperAdmin: boolean;
  hasPermission: (permissionKey: keyof ProfilePermissions | string) => boolean;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPendingLogout, startTransition] = useTransition();

  const {
    data: profileData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<AdminProfile, Error>({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      return fetcher<AdminProfile>({
        method: "get",
        url: AUTH_ENDPOINTS.PROFILE,
      });
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  const handleLogout = () => {
    startTransition(() => {
      clearAuthSession();
      router.push(ROUTES.AUTH.LOGIN);
      router.refresh();
    });
  };

  const isSuperAdmin =
    profileData?.roleCode === "SUPER_ADMIN" || profileData?.role === "super_admin";

  const hasPermission = (permissionKey: keyof ProfilePermissions | string): boolean => {
    if (isSuperAdmin) return true;
    if (!profileData?.permissions) return false;
    return profileData.permissions[permissionKey] === 1;
  };

  if (isLoading) {
    return <ProfileLoadingScreen />;
  }

  if (isError || !profileData) {
    return (
      <ProfileErrorScreen
        errorMessage={error?.message || "There was an error retrieving your session profile."}
        onRetry={() => refetch()}
        onLogout={handleLogout}
        isPendingLogout={isPendingLogout}
      />
    );
  }

  const hasAccess = hasPathPermission(pathname, profileData.permissions, isSuperAdmin);

  if (!hasAccess) {
    const hasDashboardAccess = hasPathPermission(
      ROUTES.ADMIN.DASHBOARD,
      profileData.permissions,
      isSuperAdmin,
    );

    return (
      <AccessDeniedScreen
        hasDashboardAccess={hasDashboardAccess}
        onLogout={handleLogout}
        isPendingLogout={isPendingLogout}
      />
    );
  }

  return (
    <ProfileContext.Provider
      value={{
        profile: profileData,
        isLoading: false,
        isError: false,
        isSuperAdmin,
        hasPermission,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
