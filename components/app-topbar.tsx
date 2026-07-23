"use client";
import { Bell, ChevronDown, Settings, User } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { LogoutButton } from "./logout-button";

export function AppTopBar() {
  const initials = "Admin User"
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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
        <Popover>
          <PopoverTrigger>
            <button
              className={cn(
                "group flex items-center gap-3 rounded-xl px-2 py-1.5",
                "hover:bg-accent/60",
                "transition-all duration-200",
                "outline-none",
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl",
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
                  Admin User
                </span>
                <span className="text-muted-foreground mt-1 text-[11px]">Super Admin</span>
              </div>

              <ChevronDown
                className={cn(
                  "text-muted-foreground h-4 w-4",
                  "transition-transform duration-200",
                  "group-data-[state=open]:rotate-180",
                )}
              />
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            sideOffset={8}
            className="border-border/60 w-36 gap-0 rounded-2xl p-2 shadow-xl"
          >
            <Button variant={"ghost"} className="flex justify-start text-start">
              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                <User className="text-primary h-4 w-4" />
              </div>
              Profile
            </Button>

            <Button variant={"ghost"} className="flex justify-start text-start">
              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                <Settings className="text-primary h-4 w-4" />
              </div>
              Settings
            </Button>
          </PopoverContent>
        </Popover>

        <div className="bg-border/70 mx-1 h-7 w-px" />

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

        <div className="hover:bg-accent/50 rounded-xl transition-colors">
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
