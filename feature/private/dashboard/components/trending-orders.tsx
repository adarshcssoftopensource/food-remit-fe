import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { DashboardTrendingOrder } from "../types/dashboard.types";

interface TrendingOrdersProps {
  orders?: DashboardTrendingOrder[];
  isLoading?: boolean;
}

const DEFAULT_GRADIENTS = [
  { color: "bg-emerald-50 text-emerald-600", iconColor: "text-emerald-500" },
  { color: "bg-indigo-50 text-indigo-600", iconColor: "text-indigo-500" },
  { color: "bg-amber-50 text-amber-600", iconColor: "text-amber-500" },
  { color: "bg-rose-50 text-rose-600", iconColor: "text-rose-500" },
];

function TrendingItemCard({ order, index }: { order: DashboardTrendingOrder; index: number }) {
  const [imgError, setImgError] = useState(false);
  const theme = DEFAULT_GRADIENTS[index % DEFAULT_GRADIENTS.length];
  const hasImage = Boolean(order.productImage) && !imgError;
  const imageSrc = order.productImage || "";

  return (
    <Link href={`/catalogue-management/items/${order.id}`} className="group block">
      <Card className="overflow-hidden rounded-xl border border-slate-200/70 bg-white p-0 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
        <div
          className={`relative flex h-40 w-full items-center justify-center overflow-hidden ${order.color || theme.color}`}
        >
          {hasImage ? (
            <Image
              src={imageSrc}
              alt={order.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <ImageIcon className={`${order.iconColor || theme.iconColor} opacity-40`} size={40} />
          )}
        </div>

        <div className="space-y-3 p-4">
          <div>
            <h3 className="group-hover:text-primary line-clamp-1 text-base font-semibold text-slate-800 transition-colors">
              {order.name}
            </h3>
            <p className="text-muted-foreground mt-1 text-xs">{order.orders || 0} Orders</p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-emerald-600">{order.price}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              Trending
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function TrendingOrders({ orders = [], isLoading }: TrendingOrdersProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-slate-200/60 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 px-6 py-4">
        <CardTitle className="text-lg font-bold tracking-wide text-slate-800 uppercase">
          Trending Orders
        </CardTitle>
        <Button asChild size="sm" className="h-8 rounded-full px-5 text-xs font-semibold">
          <Link href="/catalogue-management/items">View All</Link>
        </Button>
      </CardHeader>

      <CardContent className="p-6">
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-slate-100 p-0">
                <Skeleton className="h-40 w-full" />
                <div className="space-y-3 p-4">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-6 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {orders.map((order, index) => (
              <TrendingItemCard key={order.id} order={order} index={index} />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm font-semibold text-slate-400">No trending orders yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
