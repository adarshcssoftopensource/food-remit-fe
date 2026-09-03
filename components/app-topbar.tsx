"use client";
import { ArrowLeftRight, Bell, ChevronDown, Settings, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { APP_ASSETS } from "@/config/assets";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { useProfile } from "@/components/providers/profile-provider";
import { hasPathPermission } from "@/config/permissions";
import { ROUTES } from "@/config/routes";
import { useLogout } from "@/hooks/use-logout";
import { getInitials } from "@/lib/get-initials";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

export function AppTopBar() {
  const { profile, isSuperAdmin } = useProfile();
  const hasCMSPermission = hasPathPermission(
    ROUTES.ADMIN.CONTENT_MANAGEMENT.ROOT,
    profile?.permissions,
    isSuperAdmin,
  );
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isCmsContext = searchParams.get("context") === "cms";
  const inCmsMode = pathname.startsWith(ROUTES.ADMIN.CONTENT_MANAGEMENT.ROOT) || isCmsContext;

  const displayName = profile?.name || "Admin User";
  const initials = getInitials(displayName);

  const isProfilePage = pathname === ROUTES.ADMIN.PROFILE;
  const isSettingsPage = pathname === ROUTES.ADMIN.SETTINGS;

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const { handleLogout: performLogout, isPending: isLogoutPending } = useLogout();

  const handleLogoutConfirm = async () => {
    setIsLogoutConfirmOpen(false);
    await performLogout();
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-16 shrink-0 items-center",
        "bg-white/85 backdrop-blur-xl dark:bg-slate-950/85",
        "px-4 lg:px-6",
        "shadow-xs",
        "bg-transparent transition-all duration-200",
      )}
    >
      <div className="flex items-center gap-3">
        {profile?.roleCode === "EMPLOYEE" || profile?.role === "employee" ? (
          <div className="flex h-10 items-center justify-center pl-2">
            <Image
              src={APP_ASSETS.LOGO.PATH}
              alt={APP_ASSETS.LOGO.ALT}
              width={100}
              height={32}
              className="h-auto max-h-8 w-auto object-contain drop-shadow-xs"
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </div>
        ) : (
          <SidebarTrigger
            className={cn(
              "h-10 w-10 rounded-xl",
              "text-slate-600 dark:text-slate-400",
              "hover:bg-slate-100/80 hover:text-slate-900 dark:hover:bg-slate-800/80 dark:hover:text-slate-100",
              "transition-all duration-200",
            )}
          />
        )}
        <div className="h-6 w-px bg-slate-200/80 dark:bg-slate-800" />
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className={cn(
            "relative h-10 w-10 rounded-xl",
            "text-slate-600 dark:text-slate-400",
            "hover:bg-slate-100/80 hover:text-slate-900 dark:hover:bg-slate-800/80 dark:hover:text-slate-100",
            "transition-all duration-200",
          )}
        >
          <Bell className="h-5 w-5" />
          <span
            className={cn(
              "absolute -top-0.5 -right-0.5",
              "flex h-5 min-w-5 items-center justify-center",
              "rounded-full",
              "bg-linear-to-r from-emerald-600 to-teal-600",
              "px-1",
              "text-[10px] font-bold text-white",
              "shadow-xs",
              "ring-2 ring-white dark:ring-slate-950",
            )}
          >
            0
          </span>
        </Button>
        <div className="mx-1 h-7 w-px bg-slate-200/80 dark:bg-slate-800" />
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger
            className={cn(
              "group flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 transition-all duration-200 outline-none",
              isProfilePage || isSettingsPage
                ? "bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20"
                : "hover:bg-slate-100/80 dark:hover:bg-slate-800/80",
            )}
          >
            <div
              className={cn(
                "flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-xl",
                "bg-linear-to-br from-emerald-600 to-teal-700",
                "text-white",
                "text-xs font-bold",
                "shadow-xs ring-2 ring-emerald-500/20",
              )}
            >
              {profile?.image ? (
                <Image
                  src={profile.image}
                  alt={displayName}
                  className="h-full w-full object-cover"
                  height={40}
                  width={40}
                />
              ) : (
                initials
              )}
            </div>

            <div className="hidden flex-col items-start text-left sm:flex">
              <span
                className={cn(
                  "max-w-36 truncate text-sm leading-tight font-semibold",
                  isProfilePage || isSettingsPage
                    ? "text-white"
                    : "text-slate-900 dark:text-slate-100",
                )}
              >
                {displayName}
              </span>
              {profile?.stores && profile.stores.length > 0 && (
                <span
                  className={cn(
                    "max-w-36 truncate text-[10px] font-medium",
                    isProfilePage || isSettingsPage
                      ? "text-emerald-100"
                      : "text-slate-500 dark:text-slate-400",
                  )}
                >
                  {profile.stores.map((s) => s.storeName).join(", ")}
                </span>
              )}
            </div>

            <ChevronDown
              className={cn(
                "h-4 w-4",
                isProfilePage || isSettingsPage ? "text-white" : "text-slate-400",
                "transition-transform duration-200",
                "group-data-[state=open]:rotate-180",
              )}
            />
          </PopoverTrigger>

          <PopoverContent
            align="end"
            sideOffset={8}
            className="w-44 gap-1 rounded-2xl border border-slate-200/80 bg-white/95 p-1.5 shadow-xl backdrop-blur-2xl dark:border-slate-800/80 dark:bg-slate-900/95"
          >
            <Link
              href={inCmsMode ? `${ROUTES.ADMIN.PROFILE}?context=cms` : ROUTES.ADMIN.PROFILE}
              className="w-full"
              onClick={() => setIsPopoverOpen(false)}
            >
              <Button
                variant={"ghost"}
                className={cn(
                  "flex w-full items-center justify-start gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200",
                  isProfilePage &&
                    "bg-emerald-50 font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
                )}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  <User className="h-3.5 w-3.5" />
                </div>
                Profile
              </Button>
            </Link>
            {hasCMSPermission && (
              <Link
                href={inCmsMode ? ROUTES.ADMIN.DASHBOARD : ROUTES.ADMIN.CONTENT_MANAGEMENT.ROOT}
                className="w-full"
                onClick={() => setIsPopoverOpen(false)}
              >
                <Button
                  variant={"ghost"}
                  className={cn(
                    "flex w-full items-center justify-start gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200",
                  )}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                    <ArrowLeftRight className="h-3.5 w-3.5" />
                  </div>
                  {inCmsMode ? "Admin Dashboard" : "CMS Dashboard"}
                </Button>
              </Link>
            )}
            {!(profile?.roleCode === "EMPLOYEE" || profile?.role === "employee") && (
              <Link
                href={inCmsMode ? `${ROUTES.ADMIN.SETTINGS}?context=cms` : ROUTES.ADMIN.SETTINGS}
                className="w-full"
                onClick={() => setIsPopoverOpen(false)}
              >
                <Button
                  variant={"ghost"}
                  className={cn(
                    "flex w-full items-center justify-start gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200",
                    isSettingsPage &&
                      "bg-emerald-50 font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
                  )}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                    <Settings className="h-3.5 w-3.5" />
                  </div>
                  Settings
                </Button>
              </Link>
            )}
            <Button
              variant={"ghost"}
              className="flex w-full items-center justify-start gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-500/10"
              onClick={() => {
                setIsPopoverOpen(false);
                setIsLogoutConfirmOpen(true);
              }}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100 dark:bg-red-500/20">
                <LogOut className="h-3.5 w-3.5 text-red-500" />
              </div>
              Logout
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      <ConfirmationDialog
        open={isLogoutConfirmOpen}
        onOpenChange={setIsLogoutConfirmOpen}
        title="Confirm Logout"
        description="Are you sure you want to logout from this device? You will need to sign in again to access your account."
        confirmLabel="Yes, Logout"
        cancelLabel="Stay Logged In"
        onConfirm={handleLogoutConfirm}
        isLoading={isLogoutPending}
        variant="destructive"
        icon={<LogOut className="h-5 w-5" />}
      />
    </header>
  );
}
