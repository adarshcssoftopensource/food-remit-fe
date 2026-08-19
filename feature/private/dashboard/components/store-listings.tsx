"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DASHBOARD_ROUTES } from "@/constants/dashboard";
import { MapPin, Store as StoreIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { DashboardStoreListing } from "../types/dashboard.types";
import { DashboardActionButton } from "./common/dashboard-action-button";
import { DashboardCard } from "./common/dashboard-card";
import { DashboardEmptyState } from "./common/dashboard-empty-state";

interface StoreListingsProps {
  stores?: DashboardStoreListing[];
  isLoading?: boolean;
}

function StoreCard({ store }: { store: DashboardStoreListing }) {
  const [imgError, setImgError] = useState(false);
  const imageSrc = store.storeImageUrl || store.storeImage || "";
  const hasImage = Boolean(imageSrc) && !imgError;

  return (
    <Link
      href={`${DASHBOARD_ROUTES.STORES}/${store.id}`}
      className="group block focus:outline-hidden"
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg dark:border-slate-800/80 dark:bg-slate-900/90">
        <div className="relative flex h-40 w-full items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-800">
          {hasImage ? (
            <Image
              src={imageSrc}
              alt={store.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-600">
              <StoreIcon size={36} />
              <span className="text-[10px] font-semibold tracking-wider uppercase">Store</span>
            </div>
          )}

          <Badge className="absolute top-3 right-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-xs backdrop-blur-md hover:bg-white dark:bg-slate-900/95 dark:text-slate-200">
            Active Store
          </Badge>
        </div>

        <div className="space-y-3 p-4.5">
          <div>
            <h4 className="group-hover:text-primary line-clamp-1 text-sm font-bold text-slate-800 transition-colors dark:text-slate-200">
              {store.name}
            </h4>

            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="text-primary h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {store.city || "City"}, {store.country || "Country"}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100/90 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-800/50">
            <p className="line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              {store.address || "Address not specified"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function StoreListings({ stores = [], isLoading = false }: StoreListingsProps) {
  return (
    <DashboardCard
      title="New Store Listings"
      subtitle="Recently onboarded regional supermarket and grocery partners"
      accentColor="cyan"
      className="min-w-0 overflow-hidden"
      icon={
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400">
          <StoreIcon className="h-4.5 w-4.5" />
        </div>
      }
      action={<DashboardActionButton href={DASHBOARD_ROUTES.STORES} label="View All Stores" />}
    >
      {isLoading ? (
        <div className="grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-slate-100 p-0 dark:border-slate-800"
            >
              <Skeleton className="h-40 w-full" />
              <div className="space-y-3 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : stores.length > 0 ? (
        <div className="grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      ) : (
        <DashboardEmptyState
          icon={StoreIcon}
          title="No Stores Listed Yet"
          description="Newly registered stores will appear here automatically."
        />
      )}
    </DashboardCard>
  );
}
