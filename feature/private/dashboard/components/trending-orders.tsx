"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { DASHBOARD_ROUTES } from "@/constants/dashboard";
import { Flame, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { DashboardTrendingOrder } from "../types/dashboard.types";
import { DashboardActionButton } from "./common/dashboard-action-button";
import { DashboardCard } from "./common/dashboard-card";
import { DashboardEmptyState } from "./common/dashboard-empty-state";

interface TrendingOrdersProps {
  orders?: DashboardTrendingOrder[];
  isLoading?: boolean;
}

function TrendingItemCard({ order }: { order: DashboardTrendingOrder }) {
  const [imgError, setImgError] = useState(false);
  const imageSrc = order.productImageUrl || order.productImage || "";
  const hasImage = Boolean(imageSrc) && !imgError;

  return (
    <Link
      href={`${DASHBOARD_ROUTES.CATALOGUE_ITEMS}/${order.id}`}
      className="group block focus:outline-hidden"
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg dark:border-slate-800/80 dark:bg-slate-900/90">
        <div className="relative flex h-40 w-full items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-800">
          {hasImage ? (
            <Image
              src={imageSrc}
              alt={order.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-600">
              <ImageIcon size={32} />
              <span className="text-[10px] font-semibold tracking-wider uppercase">No Image</span>
            </div>
          )}

          <div className="absolute top-3 right-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-amber-700 shadow-xs backdrop-blur-md dark:bg-slate-900/95 dark:text-amber-400">
            <span className="flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 text-amber-500" />
              <span>Trending</span>
            </span>
          </div>
        </div>

        <div className="space-y-3 p-4.5">
          <div>
            <h4 className="group-hover:text-primary line-clamp-1 text-sm font-bold text-slate-800 transition-colors dark:text-slate-200">
              {order.name}
            </h4>
            <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
              {order.orders > 0 ? `${order.orders} Orders Placed` : "Featured Item"}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Price
            </span>
            <span className="rounded-lg bg-emerald-50 px-2.5 py-0.5 text-xs font-black text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
              {order.price}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function TrendingOrders({ orders = [], isLoading = false }: TrendingOrdersProps) {
  return (
    <DashboardCard
      title="Trending Items & Orders"
      subtitle="Highest velocity catalogue selections and items"
      accentColor="amber"
      className="min-w-0 overflow-hidden"
      icon={
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
          <Flame className="h-4.5 w-4.5" />
        </div>
      }
      action={
        <DashboardActionButton href={DASHBOARD_ROUTES.CATALOGUE_ITEMS} label="View Catalogue" />
      }
    >
      {isLoading ? (
        <div className="grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-slate-100 p-0 dark:border-slate-800"
            >
              <Skeleton className="h-40 w-full" />
              <div className="space-y-3 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
                <div className="border-t border-slate-100 pt-2.5 dark:border-slate-800">
                  <Skeleton className="h-5 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {orders.map((order) => (
            <TrendingItemCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <DashboardEmptyState
          icon={Flame}
          title="No Trending Orders Yet"
          description="Popular catalogue items will be highlighted here automatically."
        />
      )}
    </DashboardCard>
  );
}
