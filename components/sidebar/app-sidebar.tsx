"use client";

import { usePathname, useSearchParams } from "next/navigation";
import * as React from "react";

import { useProfile } from "@/components/providers/profile-provider";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cmsNavigationItems, adminNavigationItems, vendorNavigationItems } from "@/config/nav";
import { hasPathPermission } from "@/config/permissions";
import { ROUTES } from "@/config/routes";

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

  const isSubItemActive = React.useCallback(
    (
      item: { url: string; items?: { title: string; url: string }[] },
      sub: { title: string; url: string },
      currentPath: string | null,
    ) => {
      if (!currentPath) return false;

      if (currentPath === sub.url) return true;

      if (
        item.items?.length === 1 &&
        (currentPath === item.url || currentPath.startsWith(item.url + "/"))
      ) {
        return true;
      }

      if (currentPath.startsWith(sub.url + "/")) {
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

  type NavItem = {
    group?: string;
    title: string;
    url: string;
    icon: any;
    isComingSoon?: boolean;
    isNewFeature?: boolean;
    items?: { title: string; url: string }[];
  };

  const activeNavItems: NavItem[] = React.useMemo(() => {
    if (pathname?.startsWith(ROUTES.ADMIN.CONTENT_MANAGEMENT.ROOT) || isCmsContext) {
      return cmsNavigationItems as unknown as NavItem[];
    }
    return (
      profile?.role === "store_manager" ? vendorNavigationItems : adminNavigationItems
    ) as NavItem[];
  }, [pathname, isCmsContext, profile?.role]);

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

  const allowedNavItems = React.useMemo(() => {
    return activeNavItems
      .filter((item) => {
        const isEmployee = profile?.roleCode === "EMPLOYEE" || profile?.role === "employee";
        const isStoreManager =
          profile?.roleCode === "STORE_MANAGER" || profile?.role === "store_manager";
        if (item.title === "My Orders") return isEmployee || isStoreManager;
        if (item.title === "Order Management") return !isEmployee;
        return true;
      })
      .map((item) => {
        if (item.items && item.items.length > 0) {
          const filteredSubs = item.items.filter((sub) => {
            if (!hasPathPermission(sub.url, profile?.permissions, isSuperAdmin)) {
              return false;
            }
            const isStoreManager =
              profile?.roleCode === "STORE_MANAGER" || profile?.role === "store_manager";
            if (item.title === "Product Catalog Oversight" && isStoreManager) {
              if (sub.title === "Departments" || sub.title === "Categories") {
                return false;
              }
            }
            return true;
          });
          return { ...item, items: filteredSubs };
        }
        return item;
      })
      .filter((item) => {
        if (item.items && item.items.length === 0) {
          return false;
        }
        return hasPathPermission(item.url, profile?.permissions, isSuperAdmin);
      });
  }, [activeNavItems, profile?.permissions, isSuperAdmin, profile?.roleCode, profile?.role]);

  const filteredNavItems = React.useMemo(() => {
    if (!searchQuery) return allowedNavItems;
    const lowerQuery = searchQuery.toLowerCase();
    return allowedNavItems.filter((item) => {
      if (item.title.toLowerCase().includes(lowerQuery)) return true;
      if (item.items?.some((sub) => sub.title.toLowerCase().includes(lowerQuery))) return true;
      return false;
    });
  }, [allowedNavItems, searchQuery]);

  // Group items by their group property
  const groupedItems = React.useMemo(() => {
    const groups: { [key: string]: NavItem[] } = {};
    filteredNavItems.forEach((item) => {
      const groupName = item.group || "OTHER";
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(item);
    });
    return groups;
  }, [filteredNavItems]);

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

      <SidebarContent className="px-2.5 py-2.5">
        {!filteredNavItems.length && !isCollapsed && (
          <div className="py-6 text-center font-medium text-slate-400">No menu items found</div>
        )}
        <TooltipProvider delay={150}>
          {Object.entries(groupedItems).map(([groupName, items]) => (
            <SidebarGroup key={groupName} className="mb-4 p-0 last:mb-0">
              {!isCollapsed && groupName !== "OTHER" && (
                <SidebarGroupLabel className="px-2 pt-2 pb-1 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  {groupName}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu className="gap-1.5">
                  {items.map((item) => (
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
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </TooltipProvider>
      </SidebarContent>
    </Sidebar>
  );
}
