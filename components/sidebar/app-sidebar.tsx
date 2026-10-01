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
import { cmsNavigationItems, navigationItems } from "@/config/nav";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";

import {
  filterAllowedNavItems,
  getInitialOpenGroup,
  groupNavItems,
  hasGroupActiveChild,
  isSubItemActive,
} from "./app-sidebar-utils";
import { SidebarHeader as AppSidebarHeader } from "./sidebar-header";
import { SidebarNavItem } from "./sidebar-nav-item";

function SidebarSectionHeader({
  label,
  collapsible,
  isFirst,
  isSectionCollapsed,
  onToggle,
}: {
  label: string;
  collapsible: boolean;
  isFirst: boolean;
  isSectionCollapsed: boolean;
  onToggle: () => void;
}) {
  const className = cn(
    "group/sec flex items-center justify-between px-3 pb-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase transition-colors select-none dark:text-slate-500",
    isFirst ? "pt-1" : "pt-4",
    collapsible ? "cursor-pointer hover:text-slate-600 dark:hover:text-slate-300" : "",
  );

  if (!collapsible) {
    return (
      <div className={className}>
        <span>{label}</span>
      </div>
    );
  }

  return (
    <button type="button" onClick={onToggle} className={cn(className, "w-full")}>
      <span>{label}</span>
      <ChevronDown
        className={cn(
          "h-3.5 w-3.5 text-slate-400/80 transition-transform duration-200 group-hover/sec:text-slate-600 dark:text-slate-500 dark:group-hover/sec:text-slate-300",
          isSectionCollapsed && "-rotate-90",
        )}
      />
    </button>
  );
}

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

  const activeNavItems = React.useMemo(() => {
    return pathname?.startsWith(ROUTES.ADMIN.CONTENT_MANAGEMENT.ROOT) || isCmsContext
      ? (cmsNavigationItems as unknown as typeof navigationItems)
      : navigationItems;
  }, [pathname, isCmsContext]);

  const [prevPathname, setPrevPathname] = React.useState(pathname);
  const [openGroup, setOpenGroup] = React.useState<string | null>(() =>
    getInitialOpenGroup(activeNavItems, pathname),
  );

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

  const allowedNavItems = React.useMemo(
    () => filterAllowedNavItems(activeNavItems, profile, isSuperAdmin),
    [activeNavItems, profile, isSuperAdmin],
  );

  const filteredNavItems = React.useMemo(() => {
    if (!searchQuery) return allowedNavItems;
    const lowerQuery = searchQuery.toLowerCase();
    return allowedNavItems.filter((item) => {
      if (item.title.toLowerCase().includes(lowerQuery)) return true;
      if (item.items?.some((sub) => sub.title.toLowerCase().includes(lowerQuery))) return true;
      return false;
    });
  }, [allowedNavItems, searchQuery]);

  const groupedNavItems = React.useMemo(() => groupNavItems(filteredNavItems), [filteredNavItems]);

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
                      <SidebarSectionHeader
                        label={group.label}
                        collapsible={group.collapsible}
                        isFirst={groupIdx === 0}
                        isSectionCollapsed={isSectionCollapsed}
                        onToggle={() => toggleSection(group.label)}
                      />
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
