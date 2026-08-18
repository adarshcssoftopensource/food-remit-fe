"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const ACCENT_BORDER_MAP = {
  emerald: "before:bg-emerald-500",
  indigo: "before:bg-indigo-500",
  amber: "before:bg-amber-500",
  rose: "before:bg-rose-500",
  cyan: "before:bg-cyan-500",
  violet: "before:bg-violet-500",
  none: "",
};

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
            "flex flex-row items-center justify-between gap-3 border-b border-slate-100/90 px-6 py-4.5 dark:border-slate-800/80",
            headerClassName,
          )}
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {icon && <div className="shrink-0">{icon}</div>}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {title && (
                  <CardTitle className="truncate text-sm font-bold tracking-wider text-slate-800 uppercase dark:text-slate-200">
                    {title}
                  </CardTitle>
                )}
                {badge && <div className="shrink-0">{badge}</div>}
              </div>
              {subtitle && (
                <p className="mt-0.5 truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </CardHeader>
      )}
      <CardContent className={cn("p-6", contentClassName)}>{children}</CardContent>
    </Card>
  );
}
