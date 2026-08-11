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
    <Card className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div
        className={`absolute -top-16 -right-16 h-56 w-56 rounded-full ${iconWrapperClassName}`}
      />
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
            <div className="absolute top-0 right-0 h-full w-[42%] overflow-hidden">
              <Icon
                className={`absolute right-5 bottom-5 mb-8 h-28 w-28 opacity-[0.08] ${iconClassName}`}
                strokeWidth={1.4}
              />

              <div
                className={`absolute top-1/2 -right-8.75 h-32 w-32 -translate-y-1/2 rounded-full border-18 opacity-[0.06] ${iconClassName}`}
              />
            </div>

            <div className="relative z-10 p-7">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${iconClassName.replace("text-", "bg-")}`} />

                <p className="text-[12px] font-bold tracking-[0.16em] text-slate-500 uppercase dark:text-slate-400">
                  {label}
                </p>
              </div>

              <div className="mt-5">
                <h2
                  className={`text-[46px] leading-none font-black tracking-[-0.065em] ${iconClassName}`}
                >
                  {value}
                </h2>
              </div>

              <div className="mt-7 flex items-center gap-3">
                {trendValue && (
                  <div className="flex items-center gap-2 rounded-full bg-emerald-500 px-3 py-1.5 shadow-sm shadow-emerald-500/20">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[10px] font-black text-white">
                      ↗
                    </span>

                    <span className="text-xs font-bold text-white">{trendValue}</span>
                  </div>
                )}

                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                  {trendLabel}
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
