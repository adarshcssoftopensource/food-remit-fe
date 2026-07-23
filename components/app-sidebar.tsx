"use client";

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
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { navigationItems } from "@/config/nav";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

export function AppSidebar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const activeGroup = useMemo(() => {
    const activeNav = navigationItems.find((item) => {
      if (item.url === "/dashboard" && pathname === "/") return true;
      return pathname?.startsWith(item.url);
    });

    return activeNav?.items?.length ? activeNav.title : null;
  }, [pathname]);

  const filteredNavItems = useMemo(() => {
    if (!searchQuery) return navigationItems;

    const lowerQuery = searchQuery.toLowerCase();
    return navigationItems.filter((item) => {
      if (item.title.toLowerCase().includes(lowerQuery)) return true;
      if (item.items) {
        const matchesSub = item.items.some((subItem) =>
          subItem.title.toLowerCase().includes(lowerQuery),
        );
        if (matchesSub) return true;
      }
      return false;
    });
  }, [searchQuery]);

  const isActive = (url: string) => {
    if (url === "/dashboard" && pathname === "/") return true;
    return pathname?.startsWith(url);
  };

  return (
    <Sidebar collapsible="icon" className="bg-sidebar border-r">
      <SidebarHeader className="border-b px-3 py-4">
        <div className="flex w-full justify-center px-2 pb-2">
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/food_remid_logo.png"
              alt="Food Remit Logo"
              width={140}
              height={50}
              className="object-contain drop-shadow-sm"
              priority
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="bg-muted flex h-11 items-center rounded-xl px-3">
            <Search className="text-muted-foreground h-4 w-4" />

            <SidebarInput
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-none bg-transparent shadow-none focus-visible:ring-0"
            />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {filteredNavItems.map((item) => {
                const active = isActive(item.url);

                if (item.items?.length) {
                  const isOpen = (openGroup ?? activeGroup) === item.title || !!searchQuery;

                  return (
                    <Collapsible
                      key={item.title}
                      open={isOpen}
                      onOpenChange={(open) => setOpenGroup(open ? item.title : null)}
                      className="group"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger>
                          <SidebarMenuButton
                            className={cn(
                              "h-10 rounded-lg px-3 transition-all duration-200",
                              "hover:bg-primary/10 hover:text-primary",
                              active
                                ? "bg-primary/80! text-primary-foreground! font-medium shadow-sm"
                                : "",
                            )}
                            isActive={active && !item.items.some((sub) => pathname === sub.url)}
                            tooltip={item.title}
                          >
                            <item.icon className="h-5 w-5" />

                            <span className="flex-1">{item.title}</span>

                            <ChevronRight className="text-muted-foreground group-data-[active=true]:text-primary-foreground h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden text-sm">
                          <SidebarMenuSub className="border-border/50 mt-1.5 ml-4 border-l px-0">
                            {item.items.map((sub) => {
                              const isSubActive = pathname === sub.url;
                              return (
                                <SidebarMenuSubItem key={sub.title}>
                                  <SidebarMenuSubButton
                                    render={<Link href={sub.url} />}
                                    isActive={isSubActive}
                                    className="hover:bg-primary/10 hover:text-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:before:bg-primary relative h-9 rounded-md px-3 transition-colors before:absolute before:top-1/2 before:left-0 before:h-4 before:w-[2px] before:-translate-y-1/2 before:rounded-r-full before:bg-transparent data-[active=true]:font-medium"
                                  >
                                    {sub.title}
                                  </SidebarMenuSubButton>
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
                    <SidebarMenuButton
                      render={<Link href={item.url} />}
                      isActive={active}
                      className={cn(
                        "h-10 rounded-lg px-3 transition-all duration-200",
                        "hover:bg-primary/10 hover:text-primary",
                        active
                          ? "bg-primary/80! text-primary-foreground! font-medium shadow-sm"
                          : "",
                      )}
                      tooltip={item.title}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
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
