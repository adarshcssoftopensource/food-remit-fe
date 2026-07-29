import { Card } from "@/components/ui/card";
import { MANAGEMENT_STATS } from "@/constants/dashboard";
import { Users } from "lucide-react";

export function ManagementStats() {
  return (
    <Card className="rounded-2xl border border-slate-200/60 shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Users size={16} />
        </div>
        <h3 className="text-base font-bold text-slate-800">Management Statistics</h3>
      </div>
      <div className="grid grid-cols-2 divide-y divide-slate-100 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        {MANAGEMENT_STATS.map((stat, i) => (
          <div key={i} className="flex flex-col justify-center px-6 py-4">
            <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              {stat.title}
            </p>
            <div className="text-primary mt-3 text-4xl font-black tracking-tight">{stat.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
