"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { STATUS_TAB_ITEMS, getStatusTabCount, type StatusTabValue } from "@/constants/status-tabs";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface StatusTabsStats {
  total?: number;
  active?: number;
  inactive?: number;
}

export interface StatusTabsProps {
  activeTab: StatusTabValue;
  stats?: StatusTabsStats;
  onChange: (tab: StatusTabValue) => void;
  className?: string;
}

function useBaselineStats(
  stats?: StatusTabsStats,
  activeTab: StatusTabValue = "all",
): StatusTabsStats | undefined {
  const [cached, setCached] = useState<StatusTabsStats | undefined>(stats);

  const incomingTotal = stats?.total ?? 0;
  const cachedTotal = cached?.total ?? 0;
  const isFullDataset = activeTab === "all" || incomingTotal >= cachedTotal;

  if (
    stats &&
    isFullDataset &&
    (stats.total !== cached?.total ||
      stats.active !== cached?.active ||
      stats.inactive !== cached?.inactive)
  ) {
    setCached(stats);
  }

  if (activeTab === "all" || !cached) {
    return stats ?? cached;
  }

  return {
    total: Math.max(incomingTotal, cachedTotal),
    active: cached.active ?? stats?.active,
    inactive: cached.inactive ?? stats?.inactive,
  };
}

export function StatusTabs({ activeTab, stats, onChange, className }: StatusTabsProps) {
  const effectiveStats = useBaselineStats(stats, activeTab);

  return (
    <div className={cn("w-fit max-w-full overflow-x-auto", className)}>
      <Tabs
        value={activeTab}
        onValueChange={(val) => {
          if (val) onChange(val as StatusTabValue);
        }}
      >
        <TabsList className="inline-flex h-auto items-center gap-1.5 rounded-2xl border border-slate-200/80 bg-white/80 p-1.5 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/80">
          {STATUS_TAB_ITEMS.map((item) => {
            const isActive = activeTab === item.value;
            const count = getStatusTabCount(item.value, effectiveStats);

            return (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className={cn(
                  "relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold tracking-tight transition-all duration-200 select-none sm:text-sm",
                  "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100",
                  "focus-visible:ring-2 focus-visible:ring-emerald-500/40",
                  "data-active:bg-linear-to-r data-active:from-emerald-600 data-active:to-teal-600 data-active:font-semibold data-active:text-white data-active:shadow-md data-active:shadow-emerald-600/20",
                )}
              >
                {/* Status Dot */}
                <span
                  className={cn(
                    "size-2 shrink-0 rounded-full transition-all duration-200",
                    isActive ? "bg-white ring-2 ring-white/30" : item.dotColor,
                  )}
                />

                <span>{item.label}</span>

                {count !== undefined && (
                  <Badge
                    variant={isActive ? "secondary" : item.badgeVariant}
                    className={cn(
                      "ml-0.5 h-5 min-w-5 shrink-0 px-1.5 text-[11px] font-bold tabular-nums transition-colors duration-200",
                      isActive
                        ? "border-white/20 bg-white/20 text-white shadow-none"
                        : "border-slate-200/60 bg-slate-100 text-slate-600 dark:border-slate-700/60 dark:bg-slate-800 dark:text-slate-300",
                    )}
                  >
                    {count}
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
}

export type { StatusTabValue };
