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
      className="shadow backdrop-blur-2xl transition-all duration-300 dark:border-slate-800/70"
    >
      <SidebarHeader className="border-b border-slate-200/60 px-0 py-0 dark:border-slate-800/60">
        <div
          className={cn(
            "flex items-center justify-center transition-all duration-200",
            isCollapsed ? "h-14 px-1" : "h-18 px-4",
          )}
        >
          {isCollapsed ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-600 to-teal-700 shadow-md ring-1 shadow-emerald-600/20 ring-emerald-500/30 transition-all hover:scale-105">
              <span className="text-sm font-black tracking-wider text-white">FR</span>
            </div>
          ) : (
            <div className="flex w-full items-center justify-center px-3 py-2.5">
              <Image
                src="/food_remid_logo.png"
                alt="Food Remit"
                width={130}
                height={44}
                className="h-auto max-h-20 w-auto object-contain drop-shadow-xs"
                style={{ width: "auto", height: "auto" }}
                priority
              />
            </div>
          )}
        </div>

        {!isCollapsed && (
          <div className="mt-2 px-3 pb-3">
            <div className="group relative flex h-10 items-center gap-2 rounded-xl border border-slate-200/70 bg-white/70 px-3 shadow-xs backdrop-blur-md transition-all duration-200 focus-within:border-emerald-500 focus-within:bg-white focus-within:shadow-[0_4px_16px_-4px_rgba(16,185,129,0.25)] focus-within:ring-2 focus-within:ring-emerald-500/20 hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-900/60 dark:focus-within:bg-slate-900 dark:hover:border-slate-700">
              <Search className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-focus-within:text-emerald-600" />
              <Input
                placeholder="Search menu…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-full border-none bg-transparent p-0 text-sm shadow-none placeholder:text-slate-400 focus-visible:bg-transparent focus-visible:ring-0 dark:focus-visible:bg-transparent"
              />
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2.5 py-2.5">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <TooltipProvider delay={150}>
              <SidebarMenu className="gap-1.5">
                {!filteredNavItems.length && !isCollapsed && (
                  <div className="py-6 text-center font-medium text-slate-400">
                    No menu items found
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
                                    "flex h-11 w-full items-center justify-center rounded-xl px-2 text-[14.5px] font-medium transition-all duration-200",
                                    "border-none bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50",
                                    hasActiveChild
                                      ? "bg-linear-to-br from-emerald-600 to-teal-700 text-white shadow-md ring-1 shadow-emerald-600/25 ring-emerald-500/30"
                                      : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-100",
                                  )}
                                >
                                  <item.icon
                                    className={cn(
                                      "h-5 w-5 shrink-0",
                                      hasActiveChild
                                        ? "text-white"
                                        : "text-slate-500 dark:text-slate-400",
                                    )}
                                  />
                                </PopoverTrigger>
                              </TooltipTrigger>
                              <TooltipContent
                                side="right"
                                sideOffset={14}
                                className="border-none bg-slate-900 px-3 py-1.5 text-sm font-medium text-white shadow-xl"
                              >
                                {item.title}
                              </TooltipContent>
                            </Tooltip>
                            <PopoverContent
                              side="right"
                              align="start"
                              sideOffset={8}
                              className="w-56 rounded-2xl border border-slate-200/80 bg-white/95 p-2 shadow-xl backdrop-blur-2xl dark:border-slate-800/80 dark:bg-slate-900/95"
                            >
                              <div className="mb-2 px-2 text-xs font-bold tracking-wide text-slate-400 uppercase">
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
                                        "group/sublink flex h-9 items-center rounded-xl px-3 text-[13.5px] font-medium transition-all duration-200",
                                        "outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50",
                                        isSubActive
                                          ? "bg-emerald-50 font-semibold text-emerald-700 shadow-xs dark:bg-emerald-950/40 dark:text-emerald-300"
                                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
                                      )}
                                    >
                                      <span
                                        className={cn(
                                          "mr-2.5 h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-200",
                                          isSubActive
                                            ? "scale-125 bg-emerald-600 shadow-xs dark:bg-emerald-400"
                                            : "bg-slate-300 dark:bg-slate-600",
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
                              "group/trigger flex h-auto min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-[14.5px] font-medium transition-all duration-200",
                              "outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50",
                              hasActiveChild
                                ? "bg-emerald-500/10 font-semibold text-emerald-700 shadow-xs dark:bg-emerald-950/30 dark:text-emerald-300"
                                : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-slate-100",
                            )}
                          >
                            <item.icon
                              className={cn(
                                "h-5 w-5 shrink-0 transition-colors duration-200",
                                hasActiveChild
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-slate-500 group-hover/trigger:text-slate-700 dark:text-slate-400 dark:group-hover/trigger:text-slate-200",
                              )}
                            />
                            {!isCollapsed && (
                              <>
                                <span className="flex-1 text-left text-[14.5px] leading-snug wrap-break-word whitespace-normal">
                                  {item.title}
                                </span>
                                <ChevronRight
                                  className={cn(
                                    "h-4 w-4 shrink-0 transition-transform duration-200",
                                    hasActiveChild
                                      ? "text-emerald-600 dark:text-emerald-400"
                                      : "text-slate-400",
                                    isOpen && "rotate-90",
                                  )}
                                />
                              </>
                            )}
                          </CollapsibleTrigger>

                          <CollapsibleContent className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
                            <SidebarMenuSub className="mt-1 ml-4 border-l-2 border-emerald-500/20 py-0.5 pr-0 pl-3 dark:border-emerald-500/30">
                              {item.items.map((sub) => {
                                const isSubActive = isSubItemActive(item, sub, pathname);
                                return (
                                  <SidebarMenuSubItem key={sub.title}>
                                    <Link
                                      href={sub.url}
                                      onClick={handleMobileClose}
                                      className={cn(
                                        "group/sublink flex h-auto min-h-9 items-center rounded-xl px-2.5 py-1.5 text-[13.5px] transition-all duration-200",
                                        "outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50",
                                        isSubActive
                                          ? "bg-emerald-50 font-bold text-emerald-700 shadow-xs dark:bg-emerald-950/40 dark:text-emerald-300"
                                          : "font-medium text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200",
                                      )}
                                    >
                                      <span
                                        className={cn(
                                          "mr-2.5 h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-200",
                                          isSubActive
                                            ? "scale-125 bg-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.7)] dark:bg-emerald-400"
                                            : "bg-slate-300 group-hover/sublink:bg-slate-400 dark:bg-slate-600",
                                        )}
                                      />
                                      <span className="text-[13.5px] leading-snug wrap-break-word whitespace-normal">
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
                        "group/link relative flex h-auto min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-[14.5px] font-medium transition-all duration-200",
                        "outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50",
                        active
                          ? isCollapsed
                            ? "bg-linear-to-br from-emerald-600 to-teal-700 text-white shadow-md ring-1 shadow-emerald-600/25 ring-emerald-500/30"
                            : "bg-linear-to-r from-emerald-600 to-teal-600 font-bold text-white shadow-md shadow-emerald-600/20"
                          : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-slate-100",
                        isCollapsed && "justify-center px-2",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 shrink-0 transition-colors duration-200",
                          active
                            ? "text-white"
                            : "text-slate-500 group-hover/link:text-slate-700 dark:text-slate-400 dark:group-hover/link:text-slate-200",
                        )}
                      />
                      {!isCollapsed && (
                        <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-0.5">
                          {item.isComingSoon && active && (
                            <ComingSoonBadge
                              size="compact"
                              label="Coming Soon"
                              showIcon
                              className="border-red-200 bg-red-50 text-red-700 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-400"
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
                          <span className="w-full text-[13.5px] leading-snug wrap-break-word whitespace-normal">
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
                            className="z-50 border-none bg-slate-900 px-3 py-1.5 text-sm font-medium text-white shadow-xl"
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
