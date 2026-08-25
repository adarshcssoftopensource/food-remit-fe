"use client";

import { ComingSoonBadge } from "@/components/common/coming-soon-badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
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
                      hasActiveChild ? "text-white" : "text-slate-500 dark:text-slate-400",
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
                      onClick={onMobileClose}
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
        onOpenChange={(open) => onGroupToggle(item.title, open)}
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
                    hasActiveChild ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400",
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
                      onClick={onMobileClose}
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
      onClick={onMobileClose}
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
          <TooltipTrigger render={<div className="w-full" />}>{linkContent}</TooltipTrigger>
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
}
