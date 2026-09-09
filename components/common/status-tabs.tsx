"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { STATUS_TAB_ITEMS, getStatusTabCount, type StatusTabValue } from "@/constants/status-tabs";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  isLoading?: boolean;
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

export function StatusTabs({
  activeTab,
  stats,
  onChange,
  className,
  isLoading = false,
}: StatusTabsProps) {
  const effectiveStats = useBaselineStats(stats, activeTab);

  const [prevActiveTab, setPrevActiveTab] = useState(activeTab);
  const [displayedTab, setDisplayedTab] = useState<StatusTabValue>(activeTab);
  const [pendingTab, setPendingTab] = useState<StatusTabValue | null>(null);
  const wasLoadingRef = useRef(false);

  // Sync displayedTab when activeTab prop changes externally (e.g. reset filters)
  if (activeTab !== prevActiveTab) {
    setPrevActiveTab(activeTab);
    if (!pendingTab) {
      setDisplayedTab(activeTab);
    }
  }

  // Track loading lifecycle: when data arrives (isLoading was true and turns false), transition
  useEffect(() => {
    if (isLoading) {
      wasLoadingRef.current = true;
    } else if (wasLoadingRef.current && !isLoading && pendingTab) {
      // Data arrived! Transition to pending tab
      setDisplayedTab(pendingTab);
      setPendingTab(null);
      wasLoadingRef.current = false;
    }
  }, [isLoading, pendingTab]);

  // Smooth fallback if data was cached or returns immediately (<50ms)
  useEffect(() => {
    if (pendingTab && !isLoading) {
      const timer = setTimeout(() => {
        setDisplayedTab(pendingTab);
        setPendingTab(null);
        wasLoadingRef.current = false;
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [pendingTab, isLoading]);

  const handleTabClick = (newTab: StatusTabValue) => {
    if (newTab === displayedTab && !pendingTab) return;
    if (newTab === pendingTab) return;
    setPendingTab(newTab);
    onChange(newTab);
  };

  return (
    <div className={cn("w-fit max-w-full overflow-x-auto", className)}>
      <Tabs
        value={displayedTab}
        onValueChange={(val) => {
          if (val) handleTabClick(val as StatusTabValue);
        }}
      >
        <TabsList className="inline-flex h-auto items-center gap-1.5 rounded-2xl border border-slate-200/80 bg-white/80 p-1.5 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/80">
          {STATUS_TAB_ITEMS.map((item) => {
            const isSelected = displayedTab === item.value;
            const isPending = pendingTab === item.value;
            const count = getStatusTabCount(item.value, effectiveStats);

            const spinnerColor =
              item.value === "ACTIVE"
                ? "text-emerald-600 dark:text-emerald-400"
                : item.value === "INACTIVE"
                  ? "text-rose-500 dark:text-rose-400"
                  : "text-slate-600 dark:text-slate-300";

            return (
              <TabsTrigger
                key={item.value}
                value={item.value}
                disabled={Boolean(pendingTab && !isPending)}
                className={cn(
                  "relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold tracking-tight transition-all duration-200 select-none sm:text-sm",
                  "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100",
                  "focus-visible:ring-2 focus-visible:ring-emerald-500/40",
                  "data-active:bg-linear-to-r data-active:from-emerald-600 data-active:to-teal-600 data-active:font-semibold data-active:text-white data-active:shadow-md data-active:shadow-emerald-600/20",
                  isPending &&
                    "bg-emerald-500/10 font-semibold text-emerald-800 ring-1 ring-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300",
                )}
              >
                {/* Status Dot OR Small Rounded Spinner */}
                {isPending ? (
                  <span className="flex size-3.5 shrink-0 items-center justify-center">
                    <Loader2 className={cn("size-3.5 animate-spin", spinnerColor)} />
                  </span>
                ) : (
                  <span
                    className={cn(
                      "size-2 shrink-0 rounded-full transition-all duration-200",
                      isSelected ? "bg-white ring-2 ring-white/30" : item.dotColor,
                    )}
                  />
                )}

                <span>{item.label}</span>

                {count !== undefined && (
                  <Badge
                    variant={isSelected ? "secondary" : item.badgeVariant}
                    className={cn(
                      "ml-0.5 h-5 min-w-5 shrink-0 px-1.5 text-[11px] font-bold tabular-nums transition-colors duration-200",
                      isSelected
                        ? "border-white/20 bg-white/20 text-white shadow-none"
                        : isPending
                          ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
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
