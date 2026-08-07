"use client";

import { Button } from "@/components/ui/button";
import { hasPathPermission } from "@/config/permissions";
import { ROUTES } from "@/config/routes";
import { fetcher } from "@/hooks/useApi";
import { AUTH_ENDPOINTS } from "@/lib/api/endpoints/auth.endpoints";
import { clearAuthSession } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, LogOut, RefreshCw, ShieldAlert } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useContext, useTransition } from "react";

export interface ProfilePermissions {
  userManagement: number;
  countryManagement: number;
  donationLogs: number;
  philanthropistsManagement: number;
  cityManagement: number;
  storeManagement: number;
  ticketManagement: number;
  feedbacks: number;
  sendNotifications: number;
  creditsManagement: number;
  catalogueManagement: number;
  contentManagement: number;
  reportManagement: number;
  couponManagement: number;
  amountLimits: number;
  imageManagement: number;
  organization: number;
  [key: string]: number;
}

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
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-md">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-xl shadow-emerald-500/10">
            <span className="text-3xl font-extrabold text-white">FR</span>
            <span className="absolute -inset-1.5 animate-ping rounded-3xl border-2 border-emerald-500/30 opacity-75"></span>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-bold tracking-tight text-slate-800">Loading Profile</h2>
            <p className="mt-1.5 text-sm text-slate-500">Setting up your workspace...</p>
          </div>

          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
        </div>
      </div>
    );
  }

  if (isError || !profileData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50 px-4 py-8">
        <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <ShieldAlert className="h-8 w-8" />
          </div>

          <h2 className="mt-6 text-xl font-bold tracking-tight text-slate-900">
            Failed to Load Workspace
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {error?.message || "There was an error retrieving your session profile."}
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Button
              onClick={() => refetch()}
              className="flex h-11 items-center justify-center gap-2 rounded-xl font-semibold shadow-sm"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>

            <Button
              variant="outline"
              disabled={isPendingLogout}
              onClick={handleLogout}
              className="flex h-11 items-center justify-center gap-2 rounded-xl font-semibold text-slate-600"
            >
              <LogOut className="h-4 w-4" />
              {isPendingLogout ? "Logging out..." : "Log In Again"}
            </Button>
          </div>
        </div>
      </div>
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
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">Access Denied</h1>
        <p className="mt-2 max-w-md text-sm text-slate-500">
          You do not have the required permissions to view this page. If you believe this is an
          error, please contact your System Administrator.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {hasDashboardAccess ? (
            <>
              <Button
                onClick={() => router.push(ROUTES.ADMIN.DASHBOARD)}
                className="h-11 rounded-xl px-6 font-semibold shadow-sm"
              >
                Go to Dashboard
              </Button>

              <Button
                variant="outline"
                onClick={() => router.back()}
                className="h-11 rounded-xl px-6 font-semibold text-slate-600"
              >
                Go Back
              </Button>

              <Button
                variant="outline"
                disabled={isPendingLogout}
                onClick={handleLogout}
                className="flex h-11 items-center gap-2 rounded-xl px-6 font-semibold text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                {isPendingLogout ? "Logging out..." : "Logout"}
              </Button>
            </>
          ) : (
            <Button
              disabled={isPendingLogout}
              onClick={handleLogout}
              className="flex h-11 items-center gap-2 rounded-xl bg-red-600 px-10 font-semibold text-white shadow-sm hover:bg-red-700"
            >
              <LogOut className="h-4 w-4" />
              {isPendingLogout ? "Logging out..." : "Logout"}
            </Button>
          )}
        </div>
      </div>
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
