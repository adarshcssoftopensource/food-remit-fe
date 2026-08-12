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
      {/* Glowing Orb Background */}
      <div
        className={`absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-40 blur-3xl transition-opacity duration-700 group-hover:opacity-50 ${iconWrapperClassName}`}
      />

      {/* Subtle Inner Border for Glass Effect */}
      <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-white/20 ring-inset dark:ring-white/5" />

      <CardContent className="relative p-0">
        {loading ? (
          <div className="p-7">
            <div className="flex justify-between">
              <div className="space-y-4">
                <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-12 w-36 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="h-20 w-20 animate-pulse rounded-[24px] bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="mt-8 h-11 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
        ) : (
          <>
            <div className="absolute top-0 right-0 h-full w-[45%] overflow-hidden">
              <Icon
                className={`absolute right-4 bottom-4 mb-8 h-32 w-32 opacity-[0.06] transition-opacity duration-700 group-hover:opacity-[0.10] ${iconClassName}`}
                strokeWidth={1.2}
              />
              <div
                className={`absolute top-1/2 -right-8 h-32 w-32 -translate-y-1/2 rounded-full border-[16px] opacity-[0.04] transition-opacity duration-700 group-hover:opacity-[0.06] ${iconClassName}`}
              />
            </div>

            <div className="relative z-10 p-7">
              <div className="flex items-center gap-2.5">
                <span className={`relative flex h-2.5 w-2.5`}>
                  <span
                    className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-40 ${iconClassName.replace("text-", "bg-")}`}
                  ></span>
                  <span
                    className={`relative inline-flex h-2.5 w-2.5 rounded-full ${iconClassName.replace("text-", "bg-")}`}
                  ></span>
                </span>

                <p className="text-[12px] font-bold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400">
                  {label}
                </p>
              </div>

              <div className="mt-6">
                <h2
                  className={`text-[48px] leading-none font-black tracking-[-0.065em] drop-shadow-sm ${iconClassName}`}
                >
                  {value}
                </h2>
              </div>

              <div className="mt-8 flex items-center gap-3">
                {trendValue && (
                  <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 ring-1 ring-emerald-500/20 backdrop-blur-md transition-colors duration-300 group-hover:bg-emerald-500/15">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                      ↗
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {trendValue}
                    </span>
                  </div>
                )}

                {trendLabel && (
                  <span className="text-xs font-medium text-slate-400 transition-colors duration-300 group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-400">
                    {trendLabel}
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
