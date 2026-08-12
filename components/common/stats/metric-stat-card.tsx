"use client";

import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

interface MetricStatCardProps {
  label: string;
  value: number;
  trendLabel?: string;
  trendValue?: string;
  icon: LucideIcon;
  iconClassName: string;
  iconWrapperClassName: string;
  loading?: boolean;
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
}: MetricStatCardProps) {
  return (
    <Card className="group relative overflow-hidden rounded-[28px] border border-white/40 bg-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl transition-shadow duration-700 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] dark:border-white/10 dark:bg-slate-950/50">
      <div
        className={`absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-40 blur-3xl transition-opacity duration-700 group-hover:opacity-50 ${iconWrapperClassName}`}
      />
      <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-white/20 ring-inset dark:ring-white/5" />
      <CardContent className="relative p-0">
        {loading ? (
          <div className="p-4">
            <div className="flex justify-between">
              <div className="space-y-3">
                <div className="h-3 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="h-16 w-16 animate-pulse rounded-[16px] bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="mt-4 h-9 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
        ) : (
          <>
            <div className="relative z-10 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`relative flex h-2 w-2`}>
                      <span
                        className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-40 ${iconClassName.replace("text-", "bg-")}`}
                      ></span>
                      <span
                        className={`relative inline-flex h-2 w-2 rounded-full ${iconClassName.replace("text-", "bg-")}`}
                      ></span>
                    </span>

                    <p className="truncate text-[11px] font-bold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-400">
                      {label}
                    </p>
                  </div>

                  <div className="mt-3">
                    <h2
                      className={`text-[36px] leading-none font-black tracking-tighter drop-shadow-sm ${iconClassName}`}
                    >
                      {value}
                    </h2>
                  </div>
                </div>

                <div
                  className={`bg-opacity-50 flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] ${iconWrapperClassName}`}
                >
                  <Icon className={`h-5 w-5 ${iconClassName}`} strokeWidth={2.5} />
                </div>
              </div>

              {(trendValue || trendLabel) && (
                <div className="mt-4 flex items-center gap-2.5">
                  {trendValue && (
                    <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 ring-1 ring-emerald-500/20 backdrop-blur-md transition-colors duration-300 group-hover:bg-emerald-500/15">
                      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                        ↗
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        {trendValue}
                      </span>
                    </div>
                  )}

                  {trendLabel && (
                    <span className="text-[11px] font-medium text-slate-400 transition-colors duration-300 group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-400">
                      {trendLabel}
                    </span>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
