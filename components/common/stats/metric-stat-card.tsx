"use client";

import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MetricStatCardProps {
  label: string;
  value: number;
  trendLabel: string;
  trendValue: string;
  icon: LucideIcon;
  iconClassName: string;
  iconWrapperClassName: string;
}

export function MetricStatCard({
  label,
  value,
  trendLabel,
  trendValue,
  icon: Icon,
  iconClassName,
  iconWrapperClassName,
}: MetricStatCardProps) {
  return (
    <Card className="group overflow-hidden rounded-2xl">
      <CardContent className="relative p-6">
        <div className="bg-muted/30 absolute -top-8 -right-8 h-28 w-28 rounded-full transition-transform duration-300 group-hover:scale-110" />

        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium tracking-wide">{label}</p>
            <h2 className={`mt-2 text-4xl font-bold ${iconClassName}`}>{value}</h2>
            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                {trendValue}
              </span>
              <span className="text-muted-foreground text-xs">{trendLabel}</span>
            </div>
          </div>

          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl ${iconWrapperClassName}`}
          >
            <Icon className={`h-8 w-8 ${iconClassName}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
