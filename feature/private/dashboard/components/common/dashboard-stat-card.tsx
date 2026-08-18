"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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

const ACCENT_GLOW_MAP = {
  emerald: "from-emerald-500/10 via-transparent to-transparent border-t-emerald-500/40",
  indigo: "from-indigo-500/10 via-transparent to-transparent border-t-indigo-500/40",
  amber: "from-amber-500/10 via-transparent to-transparent border-t-amber-500/40",
  rose: "from-rose-500/10 via-transparent to-transparent border-t-rose-500/40",
  cyan: "from-cyan-500/10 via-transparent to-transparent border-t-cyan-500/40",
  violet: "from-violet-500/10 via-transparent to-transparent border-t-violet-500/40",
};

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
        "group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300/80 hover:shadow-lg dark:border-slate-800/80 dark:bg-slate-900/90",
        accentColor && `border-t-2 ${ACCENT_GLOW_MAP[accentColor]}`,
        href && "cursor-pointer",
        className,
      )}
    >
      {/* Ambient background glow */}
      {accentColor && (
        <div
          className={cn(
            "pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-gradient-to-br opacity-40 blur-2xl transition-opacity duration-300 group-hover:opacity-70",
            ACCENT_GLOW_MAP[accentColor],
          )}
        />
      )}

      <div className="relative flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
              {title}
            </span>
            {href && (
              <ArrowUpRight className="group-hover:text-primary dark:group-hover:text-primary h-3.5 w-3.5 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 dark:text-slate-600" />
            )}
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            {isLoading ? (
              <Skeleton className="h-10 w-28 rounded-xl" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  {typeof mainValue === "number" ? mainValue.toLocaleString() : mainValue}
                </span>
                {mainLabel && (
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {mainLabel}
                  </span>
                )}
              </div>
            )}
          </div>

          {trend && !isLoading && (
            <div className="mt-2 flex items-center gap-1.5 text-xs font-medium">
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
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-xs transition-transform duration-300 group-hover:scale-110",
            iconBgClassName,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {subStats.length > 0 && (
        <div className="relative mt-5 grid grid-cols-2 gap-2 border-t border-slate-100/90 pt-4 sm:grid-cols-4 dark:border-slate-800/80">
          {subStats.map((sub, idx) => (
            <div
              key={sub.label || idx}
              className="flex flex-col rounded-xl bg-slate-50/80 p-2.5 transition-colors group-hover:bg-slate-100/70 dark:bg-slate-800/50 dark:group-hover:bg-slate-800/80"
            >
              <span className="truncate text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-400">
                {sub.label}
              </span>
              {isLoading ? (
                <Skeleton className="mt-1 h-4 w-12 rounded" />
              ) : (
                <span className="mt-0.5 truncate text-sm font-bold text-slate-800 dark:text-slate-100">
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
      <Link href={href} className="block focus:outline-hidden">
        {content}
      </Link>
    );
  }

  return content;
}
