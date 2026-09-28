"use client";

import { MetricStatCard } from "@/components/common/stats/metric-stat-card";
import { FOUNDATION_STATS_CONFIG } from "@/constants/foundation-management";

interface FoundationStatsProps {
  stats?: {
    total: number;
    active: number;
    pending: number;
  };
}

export function FoundationStats({ stats }: FoundationStatsProps) {
  const currentStats = stats || { total: 0, active: 0, pending: 0 };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {FOUNDATION_STATS_CONFIG.map(({ key, label, Icon, color, bg }) => (
        <MetricStatCard
          key={key}
          label={label}
          value={currentStats[key as keyof typeof currentStats] ?? 0}
          icon={Icon}
          iconClassName={color}
          iconWrapperClassName={bg}
        />
      ))}
    </div>
  );
}
