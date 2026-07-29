import { Card } from "@/components/ui/card";
import { OVERVIEW_CARDS } from "@/constants/dashboard";

export function OverviewStats() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {OVERVIEW_CARDS.map(({ title, icon: Icon, color, stats }) => (
        <Card
          key={title}
          className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{title}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tight text-slate-900">
                  {stats[0].value}
                </span>
                <span className="text-sm font-medium text-slate-500">{stats[0].label}</span>
              </div>
            </div>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 ${color.split(" ")[1]}`}
            >
              <Icon size={24} />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-6 border-t border-slate-100 pt-4">
            {stats.slice(1).map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-lg font-bold text-slate-800">{stat.value}</span>
                <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
