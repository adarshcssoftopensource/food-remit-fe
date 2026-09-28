import { BarChart3 } from "lucide-react";

export function StatsReadOnly({ items }: { items: { value: string; label: string }[] }) {
  return (
    <div className="space-y-4">
      <div className="bg-primary/8 border-primary/15 flex items-start gap-3 rounded-2xl border p-4">
        <div className="bg-primary/15 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
          <BarChart3 className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Live calculated stats</p>
          <p className="mt-0.5 text-xs text-slate-500">
            Countries · Vendor stores · Active products · Completed orders (status 6)
          </p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-5"
          >
            <p className="text-3xl font-bold tracking-tight text-slate-950">{item.value}</p>
            <p className="mt-1 text-sm text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
