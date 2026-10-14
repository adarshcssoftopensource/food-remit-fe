"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ACCENT_BORDER_MAP } from "@/constants/dashboard";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface DashboardCardProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  accentColor?: "emerald" | "indigo" | "amber" | "rose" | "cyan" | "violet" | "none";
}

export function DashboardCard({
  title,
  subtitle,
  icon,
  action,
  badge,
  children,
  className,
  headerClassName,
  contentClassName,
  accentColor = "none",
}: DashboardCardProps) {
  const hasHeader = Boolean(title || action || icon || subtitle || badge);

  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-200 hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900/90",
        accentColor !== "none" && [
          "before:absolute before:top-0 before:left-0 before:h-1 before:w-full before:opacity-90",
          ACCENT_BORDER_MAP[accentColor],
        ],
        className,
      )}
    >
      {hasHeader && (
        <CardHeader
          className={cn(
            "flex flex-col gap-2.5 border-b border-slate-100/90 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4 dark:border-slate-800/80",
            headerClassName,
          )}
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {icon && <div className="shrink-0">{icon}</div>}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {title && (
                  <CardTitle className="text-xs font-bold tracking-wider text-slate-800 uppercase sm:text-sm dark:text-slate-200">
                    {title}
                  </CardTitle>
                )}
                {badge && <div className="shrink-0">{badge}</div>}
              </div>
              {subtitle && (
                <p className="mt-0.5 line-clamp-1 text-[11px] font-medium text-slate-500 sm:text-xs dark:text-slate-400">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0 self-start sm:self-auto">{action}</div>}
        </CardHeader>
      )}
      <CardContent className={cn("p-6", contentClassName)}>{children}</CardContent>
    </Card>
  );
}
