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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { navigationItems } from "@/config/nav";
import { hasPathPermission } from "@/config/permissions";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();
  const { state, isMobile, toggleSidebar } = useSidebar();
  const { profile, isSuperAdmin } = useProfile();

  const isCollapsed = state === "collapsed";

  const [searchQuery, setSearchQuery] = React.useState("");

  const isSubItemActive = React.useCallback(
    (
      item: { url: string; items?: { title: string; url: string }[] },
      sub: { title: string; url: string },
      currentPath: string | null,
    ) => {
      if (!currentPath) return false;

      // Exact match
      if (currentPath === sub.url) return true;

      // Single sub-item group where parent route matches (e.g. /country-management/123 -> /country-management/list)
      if (
        item.items?.length === 1 &&
        (currentPath === item.url || currentPath.startsWith(item.url + "/"))
      ) {
        return true;
      }

      // Check if currentPath is a sub-path of sub.url (e.g. /report-management/store-report/123)
      if (currentPath.startsWith(sub.url + "/")) {
        // If another sibling sub-item is also matched and has a longer (more specific) URL, this sub is not active
        const hasMoreSpecificMatch = item.items?.some(
          (otherSub) =>
            otherSub.url !== sub.url &&
            otherSub.url.length > sub.url.length &&
            (currentPath === otherSub.url || currentPath.startsWith(otherSub.url + "/")),
        );
        return !hasMoreSpecificMatch;
      }

      return false;
    },
    [],
  );

  const hasGroupActiveChild = React.useCallback(
    (
      item: { url: string; items?: { title: string; url: string }[] },
      currentPath: string | null,
    ) => {
      if (!currentPath) return false;
      if (item.items?.some((sub) => isSubItemActive(item, sub, currentPath))) return true;
      return currentPath === item.url || currentPath.startsWith(item.url + "/");
    },
    [isSubItemActive],
  );

  const [openGroup, setOpenGroup] = React.useState<string | null>(() => {
    const active = navigationItems.find(
      (item) =>
        item.items?.length &&
        (item.items.some(
          (sub) =>
            pathname === sub.url ||
            (pathname?.startsWith(sub.url + "/") &&
              !item.items.some(
                (o) =>
                  o.url !== sub.url &&
                  o.url.length > sub.url.length &&
                  (pathname === o.url || pathname?.startsWith(o.url + "/")),
              )),
        ) ||
          (item.items.length === 1 &&
            (pathname === item.url || pathname?.startsWith(item.url + "/"))) ||
          pathname === item.url ||
          pathname?.startsWith(item.url + "/")),
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
    return pathname === url || pathname?.startsWith(url + "/");
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
      className="border-border/30 bg-background/80 supports-backdrop-filter:bg-background/60 border-r shadow-[8px_0_30px_-10px_rgba(0,0,0,0.1)] backdrop-blur-3xl transition-all duration-300 dark:bg-slate-950/80"
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
            <div className="border-border/40 focus-within:border-primary/80 focus-within:ring-primary/20 flex h-10 items-center gap-2 rounded-xl border bg-slate-50/50 px-3 backdrop-blur-md transition-all duration-300 focus-within:bg-white focus-within:shadow-[0_4px_20px_-5px_rgba(16,185,129,0.2)] focus-within:ring-2 hover:bg-slate-100/50 dark:bg-slate-900/50 dark:focus-within:bg-slate-900 dark:hover:bg-slate-800/50">
              <Search className="text-muted-foreground/70 focus-within:text-primary h-4 w-4 shrink-0 transition-colors" />
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
            <TooltipProvider delay={150}>
              <SidebarMenu className="gap-0.5">
                {!filteredNavItems.length && !isCollapsed && (
                  <div className="text-muted-foreground py-5 text-center text-sm">
                    No data found
                  </div>
                )}
                {filteredNavItems.map((item) => {
                  const active = isActive(item.url);

                  if (item.items?.length) {
                    const hasActiveChild = hasGroupActiveChild(item, pathname);
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
                            <Tooltip>
                              <TooltipTrigger render={<div className="w-full" />}>
                                <PopoverTrigger
                                  className={cn(
                                    "flex h-12 w-full items-center justify-center rounded-xl px-2 text-sm font-medium transition-all duration-300",
                                    "focus-visible:ring-primary/50 border-none bg-transparent outline-none focus-visible:ring-2",
                                    hasActiveChild
                                      ? "from-primary ring-primary/30 scale-105 bg-linear-to-br to-emerald-600 text-white shadow-[0_4px_15px_-3px_rgba(var(--primary),0.4)] ring-1"
                                      : "text-slate-500 hover:scale-105 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
                                  )}
                                >
                                  <item.icon
                                    className={cn(
                                      "h-4 w-4 shrink-0",
                                      hasActiveChild
                                        ? "text-primary-foreground"
                                        : "text-foreground/60",
                                    )}
                                  />
                                </PopoverTrigger>
                              </TooltipTrigger>
                              <TooltipContent
                                side="right"
                                sideOffset={14}
                                className="border-none bg-slate-900 px-3 py-1.5 font-medium text-white shadow-xl"
                              >
                                {item.title}
                              </TooltipContent>
                            </Tooltip>
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
                                  const isSubActive = isSubItemActive(item, sub, pathname);
                                  return (
                                    <Link
                                      key={sub.title}
                                      href={sub.url}
                                      onClick={handleMobileClose}
                                      className={cn(
                                        "group/sublink flex h-9 items-center rounded-lg px-3 text-sm transition-all duration-300 hover:translate-x-1",
                                        "focus-visible:ring-primary/50 outline-none focus-visible:ring-2",
                                        isSubActive
                                          ? "bg-primary/10 text-primary font-semibold"
                                          : "text-muted-foreground hover:text-foreground",
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
                        className="group/collapsible w-full"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger
                            className={cn(
                              "group/trigger flex h-auto min-h-12 w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300",
                              "focus-visible:ring-primary/50 outline-none focus-visible:ring-2",
                              hasActiveChild
                                ? "from-primary/15 text-primary after:bg-primary relative overflow-hidden bg-linear-to-r to-transparent font-semibold after:absolute after:top-0 after:left-0 after:h-full after:w-1 after:rounded-r-full"
                                : "text-foreground/70 hover:text-foreground hover:translate-x-1 hover:bg-slate-100 dark:hover:bg-slate-800",
                            )}
                          >
                            <item.icon
                              className={cn(
                                "h-4 w-4 shrink-0 transition-colors duration-300",
                                hasActiveChild
                                  ? "text-primary"
                                  : "text-foreground/60 group-hover/trigger:text-primary/70",
                              )}
                            />
                            {!isCollapsed && (
                              <>
                                <span className="flex-1 text-left leading-snug wrap-break-word whitespace-normal">
                                  {item.title}
                                </span>
                                <ChevronRight
                                  className={cn(
                                    "h-4 w-4 shrink-0 transition-transform duration-300",
                                    hasActiveChild ? "text-primary/70" : "text-muted-foreground",
                                    isOpen && "rotate-90",
                                  )}
                                />
                              </>
                            )}
                          </CollapsibleTrigger>

                          <CollapsibleContent className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
                            <SidebarMenuSub className="border-border/50 mt-0.5 ml-3.5 border-l py-0.5 pr-0 pl-3">
                              {item.items.map((sub) => {
                                const isSubActive = isSubItemActive(item, sub, pathname);
                                return (
                                  <SidebarMenuSubItem key={sub.title}>
                                    <Link
                                      href={sub.url}
                                      onClick={handleMobileClose}
                                      className={cn(
                                        "group/sublink flex h-auto min-h-10 items-center rounded-lg px-3 py-2 text-sm transition-all duration-300 hover:translate-x-1",
                                        "focus-visible:ring-primary/50 outline-none focus-visible:ring-2",
                                        isSubActive
                                          ? "bg-primary/10 text-primary font-semibold"
                                          : "text-muted-foreground hover:text-foreground",
                                      )}
                                    >
                                      <span
                                        className={cn(
                                          "mr-3 h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-300",
                                          isSubActive
                                            ? "bg-primary scale-150 shadow-[0_0_8px_rgba(var(--primary),0.8)]"
                                            : "bg-muted-foreground/30 group-hover/sublink:bg-primary/50 group-hover/sublink:scale-125",
                                        )}
                                      />
                                      <span className="leading-snug wrap-break-word whitespace-normal">
                                        {sub.title}
                                      </span>
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

                  const linkContent = (
                    <Link
                      onClick={handleMobileClose}
                      href={item.url}
                      className={cn(
                        "group/link relative flex h-auto min-h-12 w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300",
                        "focus-visible:ring-primary/50 outline-none focus-visible:ring-2",
                        active
                          ? isCollapsed
                            ? "from-primary ring-primary/30 scale-105 bg-linear-to-br to-emerald-600 text-white shadow-[0_4px_15px_-3px_rgba(var(--primary),0.4)] ring-1"
                            : "from-primary/15 text-primary after:bg-primary overflow-hidden bg-linear-to-r to-transparent font-semibold shadow-[inset_1px_0_10px_rgba(var(--primary),0.05)] after:absolute after:top-0 after:left-0 after:h-full after:w-1 after:rounded-r-full"
                          : "text-foreground/70 hover:text-foreground hover:translate-x-1 hover:bg-slate-100 dark:hover:bg-slate-800",
                        isCollapsed && "justify-center px-2",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors duration-300",
                          active
                            ? isCollapsed
                              ? "text-white"
                              : "text-primary"
                            : "text-foreground/60 group-hover/link:text-primary/70",
                        )}
                      />
                      {!isCollapsed && (
                        <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-1">
                          {item.isComingSoon && active && (
                            <ComingSoonBadge
                              size="compact"
                              label="This page is coming soon"
                              showIcon
                              className="border-red-500/30 bg-red-500/10 font-bold text-red-600 shadow-sm dark:border-red-400/40 dark:bg-red-500/20 dark:text-red-400"
                            />
                          )}
                          {item.isNewFeature && active && (
                            <ComingSoonBadge
                              size="compact"
                              label="New Feature"
                              showIcon
                              className="border-red-200 bg-red-50 text-red-700 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-400"
                            />
                          )}
                          <span className="w-full leading-snug wrap-break-word whitespace-normal">
                            {item.title}
                          </span>
                        </div>
                      )}
                    </Link>
                  );

                  return (
                    <SidebarMenuItem key={item.title}>
                      {isCollapsed ? (
                        <Tooltip>
                          <TooltipTrigger render={<div className="w-full" />}>
                            {linkContent}
                          </TooltipTrigger>
                          <TooltipContent
                            side="right"
                            sideOffset={14}
                            className="z-50 border-none bg-slate-900 px-3 py-1.5 font-medium text-white shadow-xl"
                          >
                            {item.title}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        linkContent
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </TooltipProvider>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
