"use client";

import { type ReactNode } from "react";
import { MoreHorizontal, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface DataTableRowActionItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: "default" | "destructive";
  disabled?: boolean;
  hidden?: boolean;
}

export interface DataTableRowActionsProps {
  items: DataTableRowActionItem[];
  orientation?: "vertical" | "horizontal";
  align?: "start" | "end" | "center";
  className?: string;
  triggerClassName?: string;
  children?: ReactNode;
}

export function DataTableRowActions({
  items,
  orientation = "vertical",
  align = "end",
  className,
  triggerClassName,
  children,
}: DataTableRowActionsProps) {
  const visibleItems = items.filter((item) => !item.hidden);

  if (visibleItems.length === 0 && !children) {
    return null;
  }

  const Icon = orientation === "horizontal" ? MoreHorizontal : MoreVertical;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex size-8 cursor-pointer items-center justify-center rounded-full border border-slate-200/90 bg-white/90 text-slate-500 shadow-xs transition-all hover:border-slate-300 hover:bg-slate-100/80 hover:text-slate-900 focus:ring-2 focus:ring-slate-400/20 focus:outline-none active:scale-95 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
          triggerClassName,
        )}
        aria-label="Open action menu"
      >
        <Icon className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={align}
        sideOffset={6}
        className={cn(
          "w-44 min-w-36 rounded-xl border border-slate-200/80 bg-white/95 p-1 shadow-lg backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95",
          className,
        )}
      >
        {visibleItems.map((item, index) => {
          const isDestructive = item.variant === "destructive";
          const prevItem = visibleItems[index - 1];
          const shouldAddSeparator =
            isDestructive && prevItem && prevItem.variant !== "destructive";

          return (
            <div key={`${item.label}-${index}`}>
              {shouldAddSeparator && (
                <DropdownMenuSeparator className="my-1 border-t border-slate-100 dark:border-slate-800" />
              )}
              <DropdownMenuItem
                variant={item.variant}
                disabled={item.disabled}
                onClick={item.onClick}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors outline-none",
                  isDestructive
                    ? "text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white",
                  item.disabled && "cursor-not-allowed opacity-50",
                )}
              >
                {item.icon && (
                  <span
                    className={cn(
                      "size-4 shrink-0 [&>svg]:size-4",
                      isDestructive
                        ? "text-red-500 dark:text-red-400"
                        : "text-slate-400 dark:text-slate-500",
                    )}
                  >
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
              </DropdownMenuItem>
            </div>
          );
        })}
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
