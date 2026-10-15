"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ACCENT_GLOW_MAP } from "@/constants/dashboard";
import { cn } from "@/lib/utils";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import Link from "next/link";

export interface DashboardSubStat {
  label: string;
  value: number | string;
}

export interface DashboardStatCardProps {
  title: string;
  href?: string;
  icon: LucideIcon;
  iconBgClassName?: string;
  mainValue: number | string;
  mainLabel?: string;
  subStats?: DashboardSubStat[];
  isLoading?: boolean;
  className?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  accentColor?: "emerald" | "indigo" | "amber" | "rose" | "cyan" | "violet";
}

export function DashboardStatCard({
  title,
  href,
  icon: Icon,
  iconBgClassName = "bg-primary/10 text-primary",
  mainValue,
  mainLabel,
  subStats = [],
  isLoading = false,
  className,
  trend,
  accentColor,
}: DashboardStatCardProps) {
  const content = (
    <Card
      className={cn(
        "group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-xs backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-3.5 dark:border-slate-800 dark:bg-slate-900/95",
        accentColor && `border-t-2 ${ACCENT_GLOW_MAP[accentColor]}`,
        href && "cursor-pointer",
        className,
      )}
    >
      {accentColor && (
        <div
          className={cn(
            "pointer-events-none absolute -top-8 -right-8 h-20 w-20 rounded-full bg-linear-to-br opacity-30 blur-xl transition-opacity duration-300 group-hover:opacity-60",
            ACCENT_GLOW_MAP[accentColor],
          )}
        />
      )}

      <div className="flex flex-1 flex-col justify-between">
        <div className="relative flex items-start justify-between gap-2.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-1">
              <span
                className="line-clamp-2 min-h-9 text-[11px] leading-snug font-bold tracking-wider wrap-break-word text-slate-500 uppercase dark:text-slate-400"
                title={title}
              >
                {title}
              </span>
              {href && (
                <ArrowUpRight className="group-hover:text-primary dark:group-hover:text-primary mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 dark:text-slate-600" />
              )}
            </div>

            <div className="mt-1 flex flex-wrap items-baseline gap-1.5">
              {isLoading ? (
                <Skeleton className="h-7 w-20 rounded-lg sm:h-8 sm:w-24" />
              ) : (
                <div className="flex min-w-0 flex-wrap items-baseline gap-1.5">
                  <span
                    className="truncate text-xl font-black tracking-tight text-slate-900 sm:text-2xl dark:text-white"
                    title={
                      typeof mainValue === "number" ? mainValue.toLocaleString() : String(mainValue)
                    }
                  >
                    {typeof mainValue === "number" ? mainValue.toLocaleString() : mainValue}
                  </span>
                  {mainLabel && (
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[9.5px] font-semibold whitespace-nowrap text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {mainLabel}
                    </span>
                  )}
                </div>
              )}
            </div>

            {trend && !isLoading && (
              <div className="mt-1 flex items-center gap-1 text-[10.5px] font-medium">
                <span
                  className={cn(
                    "font-bold",
                    trend.isPositive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400",
                  )}
                >
                  {trend.value}
                </span>
                {trend.label && (
                  <span className="text-slate-400 dark:text-slate-500">{trend.label}</span>
                )}
              </div>
            )}
          </div>

          <div
            className={cn(
              "flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform duration-300 group-hover:scale-105 sm:h-9 sm:w-9",
              iconBgClassName,
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </div>

      {subStats.length > 0 && (
        <div
          className={cn(
            "relative mt-2.5 grid gap-1.5 border-t border-slate-100/90 pt-2 dark:border-slate-800/80",
            subStats.length === 1 && "grid-cols-1",
            subStats.length === 2 && "grid-cols-2",
            subStats.length === 3 && "grid-cols-3",
            subStats.length >= 4 && "grid-cols-2",
          )}
        >
          {subStats.map((sub) => (
            <div
              key={sub.label}
              className="flex min-w-0 flex-col justify-center rounded-lg bg-slate-50/90 px-2 py-1 transition-colors group-hover:bg-slate-100/90 dark:bg-slate-800/60 dark:group-hover:bg-slate-800/90"
            >
              <span
                className="truncate text-[9.5px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500"
                title={sub.label}
              >
                {sub.label}
              </span>
              {isLoading ? (
                <Skeleton className="mt-1 h-3 w-10 rounded sm:h-3.5 sm:w-12" />
              ) : (
                <span
                  className="mt-0.5 truncate text-[11px] font-bold text-slate-900 sm:text-xs dark:text-slate-100"
                  title={
                    typeof sub.value === "number" ? sub.value.toLocaleString() : String(sub.value)
                  }
                >
                  {typeof sub.value === "number" ? sub.value.toLocaleString() : sub.value}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full focus:outline-hidden">
        {content}
      </Link>
    );
  }

  return content;
}
