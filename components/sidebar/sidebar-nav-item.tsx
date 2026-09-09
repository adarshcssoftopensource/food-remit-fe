"use client";

import { ComingSoonBadge } from "@/components/common/coming-soon-badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

interface NavItem {
  title: string;
  url: string;
  icon: any;
  items?: { title: string; url: string }[];
  isComingSoon?: boolean;
  isNewFeature?: boolean;
}

interface SidebarNavItemProps {
  item: NavItem;
  isCollapsed: boolean;
  pathname: string | null;
  searchQuery: string;
  openGroup: string | null;
  onGroupToggle: (title: string, open: boolean) => void;
  onMobileClose: () => void;
  isSubItemActive: (
    item: NavItem,
    sub: { title: string; url: string },
    currentPath: string | null,
  ) => boolean;
  hasGroupActiveChild: (item: NavItem, currentPath: string | null) => boolean;
  isActive: (url: string) => boolean;
}

export function SidebarNavItem({
  item,
  isCollapsed,
  pathname,
  searchQuery,
  openGroup,
  onGroupToggle,
  onMobileClose,
  isSubItemActive,
  hasGroupActiveChild,
  isActive,
}: SidebarNavItemProps) {
  const active = isActive(item.url);

  if (item.items?.length) {
    const hasActiveChild = hasGroupActiveChild(item, pathname);
    const isOpen =
      openGroup === item.title ||
      (!!searchQuery &&
        item.items.some((sub) => sub.title.toLowerCase().includes(searchQuery.toLowerCase())));

    if (isCollapsed) {
      return (
        <SidebarMenuItem key={item.title}>
          <Popover>
            <Tooltip>
              <TooltipTrigger render={<div className="w-full" />}>
                <PopoverTrigger
                  className={cn(
                    "flex h-10 w-full items-center justify-center rounded-xl px-2 text-[14px] font-medium transition-all duration-200",
                    "border-none bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50",
                    hasActiveChild
                      ? "bg-linear-to-br from-emerald-600 to-teal-700 text-white shadow-md ring-1 shadow-emerald-600/25 ring-emerald-500/30"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-100",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4.5 w-4.5 shrink-0",
                      hasActiveChild ? "text-white" : "text-slate-500 dark:text-slate-400",
                    )}
                  />
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={14}
                className="border-none bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-xl"
              >
                {item.title}
              </TooltipContent>
            </Tooltip>
            <PopoverContent
              side="right"
              align="start"
              sideOffset={8}
              className="w-52 rounded-xl border border-slate-200/80 bg-white/95 p-1.5 shadow-xl backdrop-blur-2xl dark:border-slate-800/80 dark:bg-slate-900/95"
            >
              <div className="mb-1.5 px-2.5 pt-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                {item.title}
              </div>
              <div className="flex flex-col gap-0.5">
                {item.items.map((sub) => {
                  const isSubActive = isSubItemActive(item, sub, pathname);
                  return (
                    <Link
                      key={sub.title}
                      href={sub.url}
                      onClick={onMobileClose}
                      className={cn(
                        "group/sublink flex h-8.5 items-center rounded-lg px-2.5 text-[13px] font-medium transition-all duration-150",
                        "outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50",
                        isSubActive
                          ? "bg-emerald-500/15 font-semibold text-emerald-800 shadow-2xs dark:bg-emerald-500/20 dark:text-emerald-200"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
                      )}
                    >
                      <span
                        className={cn(
                          "mr-2 h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-200",
                          isSubActive
                            ? "scale-110 bg-emerald-600 shadow-[0_0_6px_rgba(16,185,129,0.6)] dark:bg-emerald-400"
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
        onOpenChange={(open) => onGroupToggle(item.title, open)}
        className="group/collapsible w-full"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger
            className={cn(
              "group/trigger flex h-10 w-full items-center gap-2.5 rounded-xl px-3 text-[13.5px] font-medium transition-all duration-150",
              "outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50",
              hasActiveChild
                ? "bg-emerald-500/10 font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                : "text-slate-700 hover:bg-slate-100/90 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-slate-100",
            )}
          >
            <item.icon
              className={cn(
                "h-4.5 w-4.5 shrink-0 transition-colors duration-200",
                hasActiveChild
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-slate-400 group-hover/trigger:text-slate-600 dark:text-slate-400 dark:group-hover/trigger:text-slate-200",
              )}
            />
            {!isCollapsed && (
              <>
                <span className="flex-1 truncate text-left text-[13.5px] leading-snug">
                  {item.title}
                </span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 group-hover/trigger:text-slate-600 dark:text-slate-500 dark:group-hover/trigger:text-slate-300",
                    hasActiveChild && "text-emerald-600/80 dark:text-emerald-400/80",
                    !isOpen && "-rotate-90",
                  )}
                />
              </>
            )}
          </CollapsibleTrigger>

          <CollapsibleContent className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
            <SidebarMenuSub className="my-0.5 ml-4.5 border-l border-slate-200/80 py-1 pr-0 pl-2.5 dark:border-slate-800/80">
              <div className="flex flex-col gap-0.5">
                {item.items.map((sub) => {
                  const isSubActive = isSubItemActive(item, sub, pathname);
                  return (
                    <SidebarMenuSubItem key={sub.title}>
                      <Link
                        href={sub.url}
                        onClick={onMobileClose}
                        className={cn(
                          "group/sublink flex h-8.5 items-center rounded-lg px-2.5 text-[13px] transition-all duration-150",
                          "outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50",
                          isSubActive
                            ? "bg-emerald-500/15 font-semibold text-emerald-800 shadow-2xs dark:bg-emerald-500/20 dark:text-emerald-200"
                            : "font-normal text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200",
                        )}
                      >
                        <span
                          className={cn(
                            "mr-2 h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-200",
                            isSubActive
                              ? "scale-110 bg-emerald-600 shadow-[0_0_6px_rgba(16,185,129,0.6)] dark:bg-emerald-400"
                              : "bg-slate-300 group-hover/sublink:bg-slate-400 dark:bg-slate-600",
                          )}
                        />
                        <span className="truncate text-[13px] leading-snug">{sub.title}</span>
                      </Link>
                    </SidebarMenuSubItem>
                  );
                })}
              </div>
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  const linkContent = (
    <Link
      onClick={onMobileClose}
      href={item.url}
      className={cn(
        "group/link relative flex h-10 w-full items-center gap-2.5 rounded-xl px-3 text-[13.5px] font-medium transition-all duration-150",
        "outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50",
        active
          ? isCollapsed
            ? "bg-linear-to-br from-emerald-600 to-teal-700 text-white shadow-md ring-1 shadow-emerald-600/25 ring-emerald-500/30"
            : "bg-linear-to-r from-emerald-600 to-teal-600 font-semibold text-white shadow-sm shadow-emerald-600/20"
          : "text-slate-700 hover:bg-slate-100/90 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-slate-100",
        isCollapsed && "justify-center px-2",
      )}
    >
      <item.icon
        className={cn(
          "h-4.5 w-4.5 shrink-0 transition-colors duration-200",
          active
            ? "text-white"
            : "text-slate-400 group-hover/link:text-slate-600 dark:text-slate-400 dark:group-hover/link:text-slate-200",
        )}
      />
      {!isCollapsed && (
        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
          <span className="truncate text-[13.5px] leading-snug">{item.title}</span>
          {item.isComingSoon && (
            <ComingSoonBadge
              size="compact"
              label="Soon"
              className={cn(
                "shrink-0",
                active
                  ? "border-white/30 bg-white/20 text-white"
                  : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-400",
              )}
            />
          )}
          {item.isNewFeature && (
            <ComingSoonBadge
              size="compact"
              label="New"
              className={cn(
                "shrink-0",
                active
                  ? "border-white/30 bg-white/20 text-white"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-400",
              )}
            />
          )}
        </div>
      )}
    </Link>
  );

  return (
    <SidebarMenuItem key={item.title}>
      {isCollapsed ? (
        <Tooltip>
          <TooltipTrigger render={<div className="w-full" />}>{linkContent}</TooltipTrigger>
          <TooltipContent
            side="right"
            sideOffset={14}
            className="z-50 border-none bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-xl"
          >
            {item.title}
          </TooltipContent>
        </Tooltip>
      ) : (
        linkContent
      )}
    </SidebarMenuItem>
  );
}
