"use client";

import { usePathname, useSearchParams } from "next/navigation";
import * as React from "react";
import { ChevronDown } from "lucide-react";

import { useProfile } from "@/components/providers/profile-provider";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cmsNavigationItems, navigationItems, NAVIGATION_GROUPS } from "@/config/nav";
import { hasPathPermission } from "@/config/permissions";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";

import { SidebarHeader as AppSidebarHeader } from "./sidebar-header";
import { SidebarNavItem } from "./sidebar-nav-item";

export function AppSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isCmsContext = searchParams.get("context") === "cms";
  const { state, isMobile, toggleSidebar } = useSidebar();
  const { profile, isSuperAdmin } = useProfile();

  const isCollapsed = state === "collapsed";

  const [searchQuery, setSearchQuery] = React.useState("");
  const [collapsedSections, setCollapsedSections] = React.useState<Record<string, boolean>>({});

  const toggleSection = (label: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isSubItemActive = React.useCallback(
    (
      item: { url: string; items?: { title: string; url: string }[] },
      sub: { title: string; url: string },
      currentPath: string | null,
    ) => {
      if (!currentPath) return false;

      if (currentPath === sub.url) return true;

      // Single sub-item group where parent route matches (e.g. /country-management/123 -> /country-management/list)
      if (
        item.items?.length === 1 &&
        (currentPath === item.url || currentPath.startsWith(item.url + "/"))
      ) {
        return true;
      }

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

  const activeNavItems = React.useMemo(() => {
    return pathname?.startsWith(ROUTES.ADMIN.CONTENT_MANAGEMENT.ROOT) || isCmsContext
      ? (cmsNavigationItems as unknown as typeof navigationItems)
      : navigationItems;
  }, [pathname, isCmsContext]);

  const [prevPathname, setPrevPathname] = React.useState(pathname);
  const [openGroup, setOpenGroup] = React.useState<string | null>(() => {
    const active = activeNavItems.find(
      (item) =>
        item.items?.length &&
        (item.items.some(
          (sub) =>
            pathname === sub.url ||
            (pathname?.startsWith(sub.url + "/") &&
              !item.items?.some(
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

  // Adjust state during render when route changes without triggering cascading effects
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    const active = activeNavItems.find(
      (item) =>
        item.items?.length &&
        item.items.some(
          (sub) => pathname === sub.url || (pathname && pathname.startsWith(sub.url + "/")),
        ),
    );
    if (active) {
      setOpenGroup(active.title);
    }
  }

  const allowedNavItems = React.useMemo(() => {
    return activeNavItems
      .filter((item) => {
        const isEmployee = profile?.roleCode === "EMPLOYEE" || profile?.role === "employee";
        const isStoreManager =
          profile?.roleCode === "STORE_MANAGER" || profile?.role === "store_manager";
        if (item.url === ROUTES.ADMIN.MY_ORDERS || item.title === "My Orders") return isEmployee;
        if (
          item.url === ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT ||
          item.title === "Order Management" ||
          item.title === "Orders"
        ) {
          return !isEmployee;
        }
        if (
          item.url === ROUTES.ADMIN.PRODUCT_BOXES ||
          item.title === "Product Boxes Management" ||
          item.title === "Product Boxes"
        ) {
          return isStoreManager;
        }
        return true;
      })
      .map((item) => {
        // If the item has sub-items, filter them first based on permissions
        if (item.items && item.items.length > 0) {
          const filteredSubs = item.items.filter((sub) => {
            if (
              !hasPathPermission(sub.url, profile?.permissions, isSuperAdmin, profile?.roleCode)
            ) {
              return false;
            }
            const isStoreManager =
              profile?.roleCode === "STORE_MANAGER" || profile?.role === "store_manager";

            if (
              isStoreManager &&
              (sub.title === "Store Report" ||
                sub.title === "Store Reports" ||
                sub.url === ROUTES.ADMIN.REPORT_MANAGEMENT.STORE_REPORT)
            ) {
              return false;
            }

            return true;
          });
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
        return hasPathPermission(item.url, profile?.permissions, isSuperAdmin, profile?.roleCode);
      });
  }, [activeNavItems, profile?.permissions, isSuperAdmin, profile?.roleCode]);

  const filteredNavItems = React.useMemo(() => {
    if (!searchQuery) return allowedNavItems;
    const lowerQuery = searchQuery.toLowerCase();
    return allowedNavItems.filter((item) => {
      if (item.title.toLowerCase().includes(lowerQuery)) return true;
      if (item.items?.some((sub) => sub.title.toLowerCase().includes(lowerQuery))) return true;
      return false;
    });
  }, [allowedNavItems, searchQuery]);

  // Group items by approved functional categories
  const groupedNavItems = React.useMemo(() => {
    const hasAnyGroup = filteredNavItems.some((item) => !!item.group);
    if (!hasAnyGroup) {
      return [
        {
          id: "DEFAULT",
          label: "",
          collapsible: false,
          items: filteredNavItems,
        },
      ];
    }

    const groups: {
      id: string;
      label: string;
      icon?: any;
      collapsible: boolean;
      hideHeader?: boolean;
      items: typeof filteredNavItems;
    }[] = [];

    for (const g of NAVIGATION_GROUPS) {
      const itemsInGroup = filteredNavItems.filter(
        (item) => item.group === g.label || item.group === g.id,
      );
      if (itemsInGroup.length > 0) {
        groups.push({
          id: g.id,
          label: g.label,
          icon: (g as any).icon,
          collapsible: g.collapsible,
          hideHeader: (g as any).hideHeader,
          items: itemsInGroup,
        });
      }
    }

    // Any items with undefined group placed in Utilities before Recycle Bin
    const knownGroups = new Set<string>(NAVIGATION_GROUPS.flatMap((g) => [g.id, g.label]));
    const unassignedItems = filteredNavItems.filter(
      (item) => !item.group || !knownGroups.has(item.group),
    );

    if (unassignedItems.length > 0) {
      const utilGroup = groups.find((g) => g.id === "UTILITIES");
      if (utilGroup) {
        const recycleIndex = utilGroup.items.findIndex(
          (i) => i.url === ROUTES.ADMIN.RECYCLE_BIN || i.title === "Recycle Bin",
        );
        if (recycleIndex !== -1) {
          const recycleItem = utilGroup.items[recycleIndex];
          const beforeRecycle = utilGroup.items.slice(0, recycleIndex);
          const afterRecycle = utilGroup.items.slice(recycleIndex + 1);
          utilGroup.items = [...beforeRecycle, ...unassignedItems, ...afterRecycle, recycleItem];
        } else {
          utilGroup.items.push(...unassignedItems);
        }
      } else {
        groups.push({
          id: "UTILITIES",
          label: "Utilities",
          collapsible: true,
          items: unassignedItems,
        });
      }
    }

    return groups;
  }, [filteredNavItems]);

  const isActive = (url: string) => {
    if (url === "/dashboard" && pathname === "/") return true;
    if (pathname === url || pathname?.startsWith(url + "/")) return true;
    // Detail route matching for country & city managers
    if (
      url === ROUTES.ADMIN.COUNTRY_MANAGEMENT.LIST &&
      pathname?.startsWith(ROUTES.ADMIN.COUNTRY_MANAGEMENT.ROOT)
    ) {
      return true;
    }
    if (
      url === ROUTES.ADMIN.CITY_MANAGEMENT.LIST &&
      pathname?.startsWith(ROUTES.ADMIN.CITY_MANAGEMENT.ROOT)
    ) {
      return true;
    }
    return false;
  };

  const handleGroupToggle = (title: string, open: boolean) => {
    setOpenGroup(open ? title : null);
  };
  const handleMobileClose = () => {
    if (isMobile) toggleSidebar();
  };

  if (profile?.roleCode === "EMPLOYEE" || profile?.role === "employee") {
    return null;
  }

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="shadow backdrop-blur-2xl transition-colors duration-300 dark:border-slate-800/70"
    >
      <SidebarHeader className="border-b border-slate-200/60 px-0 py-0 dark:border-slate-800/60">
        <AppSidebarHeader
          isCollapsed={isCollapsed}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </SidebarHeader>

      <SidebarContent className="px-2.5 py-2">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <TooltipProvider delay={150}>
              {!filteredNavItems.length && !isCollapsed && (
                <div className="py-6 text-center font-medium text-slate-400">
                  No menu items found
                </div>
              )}

              {groupedNavItems.map((group, groupIdx) => {
                const isSectionCollapsed = !searchQuery && Boolean(collapsedSections[group.label]);

                return (
                  <div key={group.id} className="w-full">
                    {/* Collapsed rail separator between groups */}
                    {isCollapsed && groupIdx > 0 && (
                      <div className="mx-1 my-1.5 h-px bg-slate-200/60 dark:bg-slate-800/60" />
                    )}

                    {/* Section Header (visible in expanded mode) */}
                    {!isCollapsed && group.label && !group.hideHeader && (
                      <div
                        onClick={() => group.collapsible && toggleSection(group.label)}
                        className={cn(
                          "group/sec flex items-center justify-between px-3 pb-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase transition-colors select-none dark:text-slate-500",
                          groupIdx === 0 ? "pt-1" : "pt-4",
                          group.collapsible
                            ? "cursor-pointer hover:text-slate-600 dark:hover:text-slate-300"
                            : "",
                        )}
                      >
                        <span>{group.label}</span>
                        {group.collapsible && (
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 text-slate-400/80 transition-transform duration-200 group-hover/sec:text-slate-600 dark:text-slate-500 dark:group-hover/sec:text-slate-300",
                              isSectionCollapsed && "-rotate-90",
                            )}
                          />
                        )}
                      </div>
                    )}

                    {/* Group Items */}
                    <div
                      className={cn(
                        "flex flex-col gap-0.5 transition-all duration-200",
                        !isCollapsed && isSectionCollapsed && "hidden",
                      )}
                    >
                      <SidebarMenu className="gap-0.5">
                        {group.items.map((item) => (
                          <SidebarNavItem
                            key={item.title}
                            item={item}
                            isCollapsed={isCollapsed}
                            pathname={pathname}
                            searchQuery={searchQuery}
                            openGroup={openGroup}
                            onGroupToggle={handleGroupToggle}
                            onMobileClose={handleMobileClose}
                            isSubItemActive={isSubItemActive}
                            hasGroupActiveChild={hasGroupActiveChild}
                            isActive={isActive}
                          />
                        ))}
                      </SidebarMenu>
                    </div>
                  </div>
                );
              })}
            </TooltipProvider>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
