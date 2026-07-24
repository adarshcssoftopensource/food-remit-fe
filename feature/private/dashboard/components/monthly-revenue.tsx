import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MONTHLY_REVENUE } from "@/constants/dashboard";

export function MonthlyRevenue() {
  return (
    <Card className="h-full rounded-xl border shadow-sm">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
            <TrendingUp className="h-5 w-5" />
          </div>

          <div>
            <CardTitle className="text-base font-semibold">Monthly Revenue</CardTitle>

            <p className="text-muted-foreground text-xs">Revenue breakdown</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {MONTHLY_REVENUE.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">{item.label}</span>

              <span className="text-primary text-sm font-bold">{item.percentage}%</span>
            </div>

            <Progress value={item.percentage} className="h-4 rounded-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
