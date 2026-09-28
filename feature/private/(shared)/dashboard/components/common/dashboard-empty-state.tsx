"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Inbox, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface DashboardEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
  className?: string;
}

export function DashboardEmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  children,
  className,
}: DashboardEmptyStateProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center px-4 py-10 text-center", className)}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100/80 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        <Icon size={22} strokeWidth={2} />
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</p>
      {description && (
        <p className="mt-1 max-w-xs text-xs text-slate-400 dark:text-slate-500">{description}</p>
      )}
      {action && (
        <Button
          onClick={action.onClick}
          size="sm"
          variant="outline"
          className="mt-4 h-8 rounded-lg px-4 text-xs font-semibold"
        >
          {action.label}
        </Button>
      )}
      {children}
    </div>
  );
}
