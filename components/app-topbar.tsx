"use client";
import { Bell, ChevronDown, Settings, User } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { useProfile } from "@/components/providers/profile-provider";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { LogoutButton } from "./logout-button";

export function AppTopBar() {
  const { profile } = useProfile();
  const displayName = profile?.name || "Admin User";
  const displayRole = profile?.roleCode === "SUPER_ADMIN" ? "Super Admin" : "Sub Admin";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const pathname = usePathname();
  const isProfilePage = pathname === ROUTES.ADMIN.PROFILE;
  const isSettingsPage = pathname === ROUTES.ADMIN.SETTINGS;

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 shrink-0 items-center",
        "border-border/50 border-b",
        "bg-background/80 backdrop-blur-xl",
        "px-4 lg:px-6",
        "shadow-[0_4px_20px_-12px_rgba(0,0,0,0.15)]",
      )}
    >
      <div className="flex items-center gap-3">
        <SidebarTrigger
          className={cn(
            "h-10 w-10 rounded-xl",
            "text-muted-foreground",
            "hover:bg-accent hover:text-foreground",
            "transition-all duration-200",
          )}
        />

        <div className="bg-border/70 h-6 w-px" />
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className={cn(
            "relative h-10 w-10 rounded-xl",
            "text-muted-foreground",
            "hover:bg-accent hover:text-foreground",
            "transition-all duration-200",
          )}
        >
          <Bell className="h-5 w-5" />

          <span
            className={cn(
              "absolute -top-0.5 -right-0.5",
              "flex h-5 min-w-5 items-center justify-center",
              "rounded-full",
              "bg-primary",
              "px-1",
              "text-[11px] font-semibold text-white",
              "shadow-sm",
              "ring-background ring-2",
            )}
          >
            0
          </span>
        </Button>

        <div className="bg-border/70 mx-1 h-7 w-px" />
        <Popover>
          <PopoverTrigger
            className={cn(
              "group flex items-center gap-3 rounded-xl px-2 py-1.5 transition-all duration-200 outline-none",
              isProfilePage || isSettingsPage ? "bg-primary text-white" : "hover:bg-accent/60",
            )}
          >
            <div
              className={cn(
                "flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl",
                "from-primary to-primary/70 bg-linear-to-br",
                "text-primary-foreground",
                "text-xs font-bold",
                "shadow-sm",
              )}
            >
              {initials}
            </div>

            <div className="hidden flex-col items-start sm:flex">
              <span className="max-w-32 truncate text-sm leading-none font-semibold">
                {displayName}
              </span>
              <span
                className={cn(
                  "text-muted-foreground mt-1 text-[11px]",
                  isProfilePage || isSettingsPage ? "text-white" : "",
                )}
              >
                {displayRole}
              </span>
            </div>

            <ChevronDown
              className={cn(
                "text-muted-foreground h-4 w-4",
                "transition-transform duration-200",
                "group-data-[state=open]:rotate-180",
                isProfilePage || isSettingsPage ? "text-white" : "",
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
            <LogoutButton />
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
