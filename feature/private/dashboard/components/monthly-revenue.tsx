import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MONTHLY_REVENUE } from "@/constants/dashboard";
import { TrendingUp } from "lucide-react";

export function MonthlyRevenue() {
  return (
    <Card className="w-full min-w-70 rounded-xl border shadow-sm">
      <CardHeader className="border-b p-5">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
            <TrendingUp className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg font-semibold">Monthly Revenue</CardTitle>

            <p className="text-muted-foreground mt-1 text-sm">Revenue breakdown</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-5">
        {MONTHLY_REVENUE.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">{item.label}</span>

              <span className="text-primary text-sm font-bold">{item.percentage}%</span>
            </div>

            <Progress value={item.percentage} className="h-2 w-full rounded-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
