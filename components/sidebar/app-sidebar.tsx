"use client";

import { usePathname } from "next/navigation";
import * as React from "react";

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
import { navigationItems } from "@/config/nav";
import { hasPathPermission } from "@/config/permissions";

import { SidebarHeader as AppSidebarHeader } from "./sidebar-header";
import { SidebarNavItem } from "./sidebar-nav-item";

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
        <AppSidebarHeader
          isCollapsed={isCollapsed}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
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
                {filteredNavItems.map((item) => (
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
            </TooltipProvider>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
