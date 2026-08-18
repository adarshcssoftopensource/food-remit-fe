"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface MetricStatCardProps {
  label: string;
  value: number | string;
  trendLabel?: string;
  trendValue?: string;
  icon: LucideIcon;
  iconClassName: string;
  iconWrapperClassName: string;
  loading?: boolean;
  className?: string;
}

export function MetricStatCard({
  label,
  value,
  trendLabel,
  trendValue,
  icon: Icon,
  iconClassName,
  iconWrapperClassName,
  loading = false,
  className,
}: MetricStatCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/60 bg-white/75 p-4 shadow-xs backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900/80",
        className,
      )}
    >
      {/* Soft ambient background glow */}
      <div
        className={cn(
          "pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-30 blur-2xl transition-opacity duration-300 group-hover:opacity-50",
          iconWrapperClassName,
        )}
      />

      <CardContent className="relative p-0">
        {loading ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-4 w-32 rounded-full" />
          </div>
        ) : (
          <div className="space-y-2.5">
            {/* Top row: Label with live indicator dot and Icon badge */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span
                    className={cn(
                      "absolute inline-flex h-full w-full animate-ping rounded-full opacity-40",
                      iconClassName.replace("text-", "bg-"),
                    )}
                  />
                  <span
                    className={cn(
                      "relative inline-flex h-2 w-2 rounded-full",
                      iconClassName.replace("text-", "bg-"),
                    )}
                  />
                </span>
                <p className="truncate text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  {label}
                </p>
              </div>

              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform duration-300 group-hover:scale-105",
                  iconWrapperClassName,
                )}
              >
                <Icon className={cn("h-4.5 w-4.5", iconClassName)} strokeWidth={2.25} />
              </div>
            </div>

            {/* Main Value */}
            <div className="flex items-baseline gap-2">
              <h2
                className={cn(
                  "text-2xl font-black tracking-tight drop-shadow-xs sm:text-3xl",
                  iconClassName,
                )}
              >
                {typeof value === "number" ? value.toLocaleString() : value}
              </h2>
            </div>

            {/* Optional Trend footer */}
            {(trendValue || trendLabel) && (
              <div className="flex items-center gap-2 pt-0.5">
                {trendValue && (
                  <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400">
                    <span className="text-[10px]">↗</span>
                    <span>{trendValue}</span>
                  </div>
                )}
                {trendLabel && (
                  <span className="truncate text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    {trendLabel}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
