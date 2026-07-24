import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SALES_OVERVIEW } from "@/constants/dashboard";

export function SalesOverview() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {SALES_OVERVIEW.map((stat, i) => (
        <Card key={i} className="overflow-hidden rounded-xl">
          <CardHeader>
            <CardTitle className="text-xs font-bold tracking-wider uppercase">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-3">
            <div className="text-2xl font-extrabold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
