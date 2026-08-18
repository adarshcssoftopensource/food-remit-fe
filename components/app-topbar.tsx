"use client";
import { Bell, ChevronDown, Settings, User } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { useProfile } from "@/components/providers/profile-provider";
import { ROUTES } from "@/config/routes";
import { getInitials } from "@/lib/get-initials";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLogout } from "@/hooks/use-logout";
import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { LogOut } from "lucide-react";

export function AppTopBar() {
  const { profile } = useProfile();
  const pathname = usePathname();

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
        "border-b border-slate-200/80 dark:border-slate-800/80",
        "bg-white/95 backdrop-blur-md dark:bg-slate-950/95",
        "px-4 lg:px-6",
        "shadow-[0_4px_20px_-12px_rgba(15,23,42,0.08)]",
        "transition-all duration-200",
      )}
    >
      <div className="flex items-center gap-3">
        <SidebarTrigger
          className={cn(
            "h-10 w-10 rounded-xl",
            "text-slate-600 dark:text-slate-400",
            "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100",
            "transition-all duration-200",
          )}
        />

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
            "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100",
            "transition-all duration-200",
          )}
        >
          <Bell className="h-5 w-5" />

          <span
            className={cn(
              "absolute -top-0.5 -right-0.5",
              "flex h-5 min-w-5 items-center justify-center",
              "rounded-full",
              "bg-emerald-600 dark:bg-emerald-500",
              "px-1",
              "text-[11px] font-bold text-white",
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
              "group flex items-center gap-3 rounded-xl px-2.5 py-1.5 transition-all duration-200 outline-none",
              isProfilePage || isSettingsPage
                ? "bg-emerald-600 text-white shadow-xs"
                : "hover:bg-slate-100 dark:hover:bg-slate-800/80",
            )}
          >
            <div
              className={cn(
                "flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl",
                "bg-linear-to-br from-emerald-600 to-teal-700",
                "text-white",
                "text-xs font-bold",
                "shadow-xs ring-2 ring-emerald-500/20",
              )}
            >
              {initials}
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
              <span
                className={cn(
                  "text-[11px] leading-tight font-medium",
                  isProfilePage || isSettingsPage
                    ? "text-emerald-100"
                    : "text-slate-500 dark:text-slate-400",
                )}
              >
                System Admin
              </span>
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
            className="border-border/60 w-36 gap-0 rounded-2xl p-2 shadow-xl"
          >
            <Link
              href={ROUTES.ADMIN.PROFILE}
              className={cn(
                "",
                isProfilePage && "bg-primary hover:bg-primary/80 rounded-lg text-white",
              )}
              onClick={() => setIsPopoverOpen(false)}
            >
              <Button
                variant={"ghost"}
                className={cn(
                  "flex w-full justify-start text-start",
                  isProfilePage && "hover:bg-primary/80 text-white!",
                )}
              >
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                  <User className={cn("text-primary h-4 w-4", isProfilePage && "text-white")} />
                </div>
                Profile
              </Button>
            </Link>

            <Link
              href={ROUTES.ADMIN.SETTINGS}
              className={cn(
                "",
                isSettingsPage && "bg-primary hover:bg-primary/80 rounded-lg text-white",
              )}
              onClick={() => setIsPopoverOpen(false)}
            >
              <Button
                variant={"ghost"}
                className={cn(
                  "flex w-full justify-start text-start",
                  isSettingsPage && "hover:bg-primary/80 text-white!",
                )}
              >
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                  <Settings
                    className={cn("text-primary h-4 w-4", isSettingsPage && "text-white")}
                  />
                </div>
                Settings
              </Button>
            </Link>
            <Button
              variant={"ghost"}
              className="flex w-full justify-start text-start text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-500/10"
              onClick={() => {
                setIsPopoverOpen(false);
                setIsLogoutConfirmOpen(true);
              }}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 dark:bg-red-500/20">
                <LogOut className="h-4 w-4 text-red-500" />
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
