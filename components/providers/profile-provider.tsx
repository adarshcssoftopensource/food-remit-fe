"use client";

import { AccessDeniedScreen } from "@/components/access-denied-screen";
import { ProfileErrorScreen } from "@/components/profile-error-screen";
import { ProfileLoadingScreen } from "@/components/profile-loading-screen";
import { hasPathPermission } from "@/config/permissions";
import { ROUTES } from "@/config/routes";
import { fetcher } from "@/hooks/useApi";
import { AUTH_ENDPOINTS } from "@/lib/api/endpoints/auth.endpoints";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import React, { createContext, useContext } from "react";

import { API_CACHE_KEYS } from "@/lib/api/cache-keys";

export type ProfilePermissions = Record<string, number | null | undefined>;

export interface AdminProfile {
  name: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  role: string;
  roleCode: string;
  phoneNumber: string;
  permissions: ProfilePermissions;
  image?: string | null;
  address?: string | null;
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
  const pathname = usePathname();

  const {
    data: profileData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<AdminProfile, Error>({
    queryKey: API_CACHE_KEYS.ADMIN_PROFILE,
    queryFn: async () => {
      return fetcher<AdminProfile>({
        method: "get",
        url: AUTH_ENDPOINTS.PROFILE,
      });
    },
    // Keep this explicit so the profile request also remains a single attempt.
    retry: false,
  });

  const isSuperAdmin =
    profileData?.roleCode === "SUPER_ADMIN" ||
    profileData?.role === "super_admin" ||
    profileData?.role === "co_admin";

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

    return <AccessDeniedScreen hasDashboardAccess={hasDashboardAccess} />;
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
