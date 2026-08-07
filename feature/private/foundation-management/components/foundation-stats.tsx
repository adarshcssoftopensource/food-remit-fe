"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FOUNDATION_STATS_CONFIG } from "@/constants/foundation-management";

interface FoundationStatsProps {
  stats?: {
    total: number;
    active: number;
    pending: number;
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function FoundationStats({ stats }: FoundationStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {FOUNDATION_STATS_CONFIG.map(({ key, label, Icon, color, bg }) => (
        <Card
          key={key}
          className="group from-background to-muted/20 relative overflow-hidden rounded-2xl"
        >
          <div className="bg-primary/5 absolute -top-8 -right-8 h-28 w-28 rounded-full transition-transform duration-300 group-hover:scale-125" />

          <CardContent className="relative flex items-center justify-between p-6">
            <div>
              <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
                {label}
              </p>

              <h2 className={`mt-2 text-4xl font-bold ${color}`}>0</h2>
            </div>

            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bg} `}>
              <Icon className={`h-8 w-8 ${color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
