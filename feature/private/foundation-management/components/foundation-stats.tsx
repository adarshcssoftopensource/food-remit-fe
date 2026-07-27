"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FOUNDATION_STATS_CONFIG } from "@/constants/foundation-management";

interface FoundationStatsProps {
  stats: {
    total: number;
    active: number;
    pending: number;
  };
}

export function FoundationStats({ stats }: FoundationStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {FOUNDATION_STATS_CONFIG.map(({ key, label, Icon, color, bg }) => (
        <Card
          key={key}
          className="rounded-xl border border-gray-100 shadow-sm transition-shadow duration-300 hover:shadow-md"
        >
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm font-medium">{label}</p>
              <p className={`text-4xl font-bold ${color}`}>{stats[key]}</p>
            </div>
            <div className={`rounded-lg p-4 ${bg}`}>
              <Icon className={`size-7 ${color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
