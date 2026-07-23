"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronRight, Search } from "lucide-react";

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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { navigationItems } from "@/config/nav";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export function AppSidebar() {
  const pathname = usePathname();
  const { state, isMobile, toggleSidebar } = useSidebar();

  const isCollapsed = state === "collapsed";

  const [searchQuery, setSearchQuery] = React.useState("");

  const [openGroup, setOpenGroup] = React.useState<string | null>(() => {
    const active = navigationItems.find(
      (item) => item.items?.length && item.items.some((sub) => pathname?.startsWith(sub.url)),
    );
    return active?.title ?? null;
  });

  const filteredNavItems = React.useMemo(() => {
    if (!searchQuery) return navigationItems;
    const lowerQuery = searchQuery.toLowerCase();
    return navigationItems.filter((item) => {
      if (item.title.toLowerCase().includes(lowerQuery)) return true;
      if (item.items?.some((sub) => sub.title.toLowerCase().includes(lowerQuery))) return true;
      return false;
    });
  }, [searchQuery]);

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

                  return (
                    <Collapsible
                      key={item.title}
                      open={isOpen}
                      onOpenChange={(open) => handleGroupToggle(item.title, open)}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger>
                          <button
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
                          </button>
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
                      title={isCollapsed ? item.title : undefined}
                      className={cn(
                        "flex h-12 w-full items-center gap-3 rounded-xl px-4 text-sm font-medium transition-all duration-300",
                        "focus-visible:ring-primary/50 outline-none focus-visible:ring-2",
                        active
                          ? "from-primary to-primary/90 text-primary-foreground ring-primary/20 bg-linear-to-r shadow-md ring-1"
                          : "text-foreground/70 hover:bg-primary/5 hover:text-foreground",
                        isCollapsed && "px-2",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          active ? "text-primary-foreground" : "text-foreground/60",
                        )}
                      />
                      {!isCollapsed && <span className="truncate">{item.title}</span>}
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
