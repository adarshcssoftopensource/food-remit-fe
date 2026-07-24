import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TRENDING_ORDERS } from "@/constants/dashboard";
import { Image as ImageIcon } from "lucide-react";

export function TrendingOrders() {
  return (
    <Card className="overflow-hidden rounded-xl border">
      <CardHeader className="border-b px-6 py-4">
        <CardTitle className="text-xl font-semibold tracking-wide uppercase">
          Trending Orders
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TRENDING_ORDERS.map((order) => (
            <Card
              key={order.id}
              className="overflow-hidden rounded-xl border bg-white p-0 shadow-sm"
            >
              <div className={`flex h-40 w-full items-center justify-center ${order.color}`}>
                <ImageIcon className={` ${order.iconColor} opacity-40`} size={40} />
              </div>

              <div className="space-y-3 p-4">
                <div>
                  <h3 className="text-base font-semibold">{order.name}</h3>

                  <p className="text-muted-foreground mt-1 text-xs">{order.orders} Orders</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-emerald-600">{order.price}</span>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                    Trending
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
