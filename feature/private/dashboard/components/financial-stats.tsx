import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FINANCIAL_STATS } from "@/constants/dashboard";

export function FinancialStats() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {FINANCIAL_STATS.map((stat, i) => (
        <Card key={i} className="overflow-hidden rounded-xl border-none">
          <CardHeader>
            <CardTitle className="text-sm font-bold tracking-wider uppercase">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-2">
            <div className="text-3xl font-extrabold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
