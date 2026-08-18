"use client";

import { MetricStatCard } from "@/components/common/stats/metric-stat-card";
import { STAT_CONFIG } from "@/constants/users-management";
import { RecycleBinStatsProps } from "../types/recycle-bin.types";

export function RecycleBinStats({ stats, isLoading }: RecycleBinStatsProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {STAT_CONFIG.map(({ key, label, Icon, color, bg }) => (
        <MetricStatCard
          key={key}
          label={label}
          value={stats[key as keyof typeof stats]}
          icon={Icon}
          iconClassName={color}
          iconWrapperClassName={bg}
          loading={isLoading}
        />
      ))}
    </div>
  );
}
