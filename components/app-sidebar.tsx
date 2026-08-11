"use client";

import { ChevronRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { ComingSoonBadge } from "@/components/common/coming-soon-badge";
import { useProfile } from "@/components/providers/profile-provider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { navigationItems } from "@/config/nav";
import { hasPathPermission } from "@/config/permissions";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();
  const { state, isMobile, toggleSidebar } = useSidebar();
  const { profile, isSuperAdmin } = useProfile();

  const isCollapsed = state === "collapsed";

  const [searchQuery, setSearchQuery] = React.useState("");

  const [openGroup, setOpenGroup] = React.useState<string | null>(() => {
    const active = navigationItems.find(
      (item) => item.items?.length && item.items.some((sub) => pathname?.startsWith(sub.url)),
    );
    return active?.title ?? null;
  });

  const allowedNavItems = React.useMemo(() => {
    return navigationItems
      .map((item) => {
        // If the item has sub-items, filter them first based on permissions
        if (item.items && item.items.length > 0) {
          const filteredSubs = item.items.filter((sub) =>
            hasPathPermission(sub.url, profile?.permissions, isSuperAdmin),
          );
          return { ...item, items: filteredSubs };
        }
        return item;
      })
      .filter((item) => {
        // If it had sub-items but none are allowed, filter it out
        if (item.items && item.items.length === 0) {
          return false;
        }
        // Otherwise check the item's main URL permission
        return hasPathPermission(item.url, profile?.permissions, isSuperAdmin);
      });
  }, [profile, isSuperAdmin]);

  const filteredNavItems = React.useMemo(() => {
    if (!searchQuery) return allowedNavItems;
    const lowerQuery = searchQuery.toLowerCase();
    return allowedNavItems.filter((item) => {
      if (item.title.toLowerCase().includes(lowerQuery)) return true;
      if (item.items?.some((sub) => sub.title.toLowerCase().includes(lowerQuery))) return true;
      return false;
    });
  }, [allowedNavItems, searchQuery]);

  const isActive = (url: string) => {
    if (url === "/dashboard" && pathname === "/") return true;
    return pathname?.startsWith(url);
  };

  const handleGroupToggle = (title: string, open: boolean) => {
    setOpenGroup(open ? title : null);
  };
  const handleMobileClose = () => {
    if (isMobile) toggleSidebar();
  };

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="border-border/50 bg-background/95 supports-backdrop-filter:bg-background/70 border-r shadow-[4px_0_24px_-12px_rgba(0,0,0,0.15)] backdrop-blur-2xl"
    >
      <SidebarHeader className="border-border/40 border-b px-0 py-0">
        <div
          className={cn(
            "flex items-center justify-center transition-all duration-200",
            isCollapsed ? "h-14 px-1" : "h-18 px-4",
          )}
        >
          {isCollapsed ? (
            <div className="from-primary to-primary/80 ring-primary/20 flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br shadow-lg ring-1 transition-all hover:scale-105">
              <span className="text-primary-foreground text-sm font-bold tracking-wider">FR</span>
            </div>
          ) : (
            <div className="flex w-full items-center justify-center px-3 py-2.5">
              <Image
                src="/food_remid_logo.png"
                alt="Food Remit"
                width={130}
                height={44}
                className="h-auto max-h-20 w-auto object-contain"
                style={{ width: "auto", height: "auto" }}
                priority
              />
            </div>
          )}
        </div>

        {!isCollapsed && (
          <div className="mt-3 px-4 pb-4">
            <div className="border-border/40 bg-background/50 focus-within:border-primary/50 focus-within:bg-background flex h-10 items-center gap-2 rounded-xl border px-3 backdrop-blur-md transition-all duration-300 focus-within:shadow-[0_0_0_4px_rgba(var(--primary),0.1)]">
              <Search className="text-muted-foreground/70 h-4 w-4 shrink-0" />
              <Input
                placeholder="Search menu…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="placeholder:text-muted-foreground/50 h-full border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
              />
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {!filteredNavItems.length && !isCollapsed && (
                <div className="text-muted-foreground py-5 text-center text-sm">No data found</div>
              )}
              {filteredNavItems.map((item) => {
                const active = isActive(item.url);

                if (item.items?.length) {
                  const hasActiveChild = item.items.some((sub) => pathname?.startsWith(sub.url));
                  const isOpen =
                    openGroup === item.title ||
                    (!!searchQuery &&
                      item.items.some((sub) =>
                        sub.title.toLowerCase().includes(searchQuery.toLowerCase()),
                      ));

                  if (isCollapsed) {
                    return (
                      <SidebarMenuItem key={item.title}>
                        <Popover>
                          <PopoverTrigger
                            className={cn(
                              "flex h-12 w-full items-center justify-center rounded-xl px-2 text-sm font-medium transition-all duration-300",
                              "focus-visible:ring-primary/50 border-none bg-transparent outline-none focus-visible:ring-2",
                              hasActiveChild
                                ? "from-primary to-primary/90 text-primary-foreground ring-primary/20 bg-linear-to-r shadow-md ring-1"
                                : "text-foreground/70 hover:bg-primary/5 hover:text-foreground",
                            )}
                            title={item.title}
                          >
                            <item.icon
                              className={cn(
                                "h-4 w-4 shrink-0",
                                hasActiveChild ? "text-primary-foreground" : "text-foreground/60",
                              )}
                            />
                          </PopoverTrigger>
                          <PopoverContent
                            side="right"
                            align="start"
                            sideOffset={8}
                            className="w-56 p-2"
                          >
                            <div className="text-muted-foreground mb-2 px-2 text-xs font-semibold">
                              {item.title}
                            </div>
                            <div className="flex flex-col gap-1">
                              {item.items.map((sub) => {
                                const isSubActive =
                                  pathname === sub.url || pathname?.startsWith(sub.url);
                                return (
                                  <Link
                                    key={sub.title}
                                    href={sub.url}
                                    onClick={handleMobileClose}
                                    className={cn(
                                      "flex h-9 items-center rounded-lg px-3 text-sm transition-all duration-300",
                                      "focus-visible:ring-primary/50 outline-none focus-visible:ring-2",
                                      isSubActive
                                        ? "bg-primary/15 text-primary ring-primary/10 font-semibold shadow-sm ring-1"
                                        : "text-muted-foreground hover:bg-primary/5 hover:text-foreground",
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        "mr-3 h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-300",
                                        isSubActive
                                          ? "bg-primary scale-125 shadow-sm"
                                          : "bg-muted-foreground/30",
                                      )}
                                    />
                                    <span className="truncate">{sub.title}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </SidebarMenuItem>
                    );
                  }

                  return (
                    <Collapsible
                      key={item.title}
                      open={isOpen}
                      onOpenChange={(open) => handleGroupToggle(item.title, open)}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger
                          className={cn(
                            "flex h-12 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium",
                            "focus-visible:ring-primary/50 outline-none focus-visible:ring-2",
                            hasActiveChild
                              ? "from-primary to-primary/90 text-primary-foreground ring-primary/20 bg-linear-to-r"
                              : "text-foreground/70 hover:bg-primary/5 hover:text-foreground",
                          )}
                          title={isCollapsed ? item.title : undefined}
                        >
                          <item.icon
                            className={cn(
                              "h-4 w-4 shrink-0",
                              hasActiveChild ? "text-primary-foreground" : "text-foreground/60",
                            )}
                          />
                          {!isCollapsed && (
                            <>
                              <span className="flex-1 truncate text-left">{item.title}</span>
                              <ChevronRight
                                className={cn(
                                  "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                                  hasActiveChild
                                    ? "text-primary-foreground/70"
                                    : "text-muted-foreground",
                                  isOpen && "rotate-90",
                                )}
                              />
                            </>
                          )}
                        </CollapsibleTrigger>

                        <CollapsibleContent className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
                          <SidebarMenuSub className="border-border/50 mt-0.5 ml-3.5 border-l py-0.5 pr-0 pl-3">
                            {item.items.map((sub) => {
                              const isSubActive =
                                pathname === sub.url || pathname?.startsWith(sub.url);
                              return (
                                <SidebarMenuSubItem key={sub.title}>
                                  <Link
                                    href={sub.url}
                                    onClick={handleMobileClose}
                                    className={cn(
                                      "flex h-10 items-center rounded-lg px-3 text-sm transition-all duration-300",
                                      "focus-visible:ring-primary/50 outline-none focus-visible:ring-2",
                                      isSubActive
                                        ? "bg-primary/15 text-primary ring-primary/10 font-semibold shadow-sm ring-1"
                                        : "text-muted-foreground hover:bg-primary/5 hover:text-foreground",
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        "mr-3 h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-300",
                                        isSubActive
                                          ? "bg-primary scale-125 shadow-sm"
                                          : "bg-muted-foreground/30",
                                      )}
                                    />
                                    <span className="truncate">{sub.title}</span>
                                  </Link>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <Link
                      onClick={handleMobileClose}
                      href={item.url}
                      title={item.title}
                      className={cn(
                        "relative flex h-12 w-full items-center gap-3 rounded-xl px-4 text-sm font-medium transition-all duration-300",
                        "focus-visible:ring-primary/50 outline-none focus-visible:ring-2",
                        active
                          ? "from-primary to-primary/90 text-primary-foreground ring-primary/20 bg-linear-to-r shadow-md ring-1"
                          : "text-foreground/70 hover:bg-primary/5 hover:text-foreground",
                        isCollapsed && "px-2",
                        !isCollapsed && item.isComingSoon && active && "h-16 items-end pb-2.5",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          active ? "text-primary-foreground" : "text-foreground/60",
                        )}
                      />
                      {!isCollapsed && (
                        <span className="min-w-0 flex-1 truncate">{item.title}</span>
                      )}
                      {!isCollapsed && item.isComingSoon && active && (
                        <ComingSoonBadge
                          size="compact"
                          label="This page is coming soon"
                          showIcon
                          className="absolute top-1.5 left-1/2 -translate-x-1/2 border-violet-200 bg-linear-to-r from-violet-50 to-fuchsia-50 font-bold text-red-700 shadow-sm dark:border-violet-500/30 dark:from-violet-500/15 dark:to-fuchsia-500/10 dark:text-violet-200"
                        />
                      )}
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
