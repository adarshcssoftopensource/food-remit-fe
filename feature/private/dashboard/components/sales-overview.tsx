import { Card } from "@/components/ui/card";
import { SALES_OVERVIEW } from "@/constants/dashboard";
import { TrendingUp } from "lucide-react";

export function SalesOverview() {
  return (
    <Card className="rounded-2xl border border-slate-200/60 shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-50 text-pink-600">
          <TrendingUp size={16} />
        </div>
        <h3 className="text-base font-bold text-slate-800">Sales Overview</h3>
      </div>
      <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {SALES_OVERVIEW.map((stat, i) => (
          <div key={i} className="flex flex-col justify-center px-6 py-8">
            <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              {stat.title}
            </p>
            <div className="mt-3 text-4xl font-black tracking-tight text-slate-900">
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
