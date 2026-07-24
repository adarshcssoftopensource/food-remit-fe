import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, Activity, ArrowUpRight, ArrowDownRight, Package } from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    trend: "+20.1% from last month",
    trendType: "up",
    icon: CreditCard,
  },
  {
    title: "Registered Users",
    value: "+2,350",
    trend: "+180.1% from last month",
    trendType: "up",
    icon: Users,
  },
  {
    title: "Food Sent Today",
    value: "12,234",
    trend: "+19% from yesterday",
    trendType: "up",
    icon: Package,
  },
  {
    title: "Active Now",
    value: "+573",
    trend: "-201 since last hour",
    trendType: "down",
    icon: Activity,
  },
];

export function StatCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="transition-shadow duration-300 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <p className="mt-1 flex items-center text-xs text-slate-500">
              {stat.trendType === "up" ? (
                <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-3 w-3 text-rose-500" />
              )}
              <span
                className={
                  stat.trendType === "up"
                    ? "mr-1 font-medium text-emerald-500"
                    : "mr-1 font-medium text-rose-500"
                }
              >
                {stat.trend.split(" ")[0]}
              </span>{" "}
              {stat.trend.split(" ").slice(1).join(" ")}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
