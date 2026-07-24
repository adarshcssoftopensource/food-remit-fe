import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OVERVIEW_CARDS } from "@/constants/dashboard";

export function OverviewStats() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {OVERVIEW_CARDS.map(({ title, icon: Icon, color, stats }) => (
        <Card key={title} className="rounded-xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold">{title}</CardTitle>
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
              <Icon size={22} className="cursor-pointer" />
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-2.5">
              {stats.map((item) => (
                <div key={item.label} className="bg-muted/30 rounded-lg border px-3 py-2.5">
                  <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
                    {item.label}
                  </p>

                  <p className="mt-1 text-xl font-bold">{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
