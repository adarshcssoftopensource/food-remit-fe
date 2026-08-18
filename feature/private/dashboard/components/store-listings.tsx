import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Store as StoreIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { DashboardStoreListing } from "../types/dashboard.types";

interface StoreListingsProps {
  stores?: DashboardStoreListing[];
  isLoading?: boolean;
}

const STORE_CARD_GRADIENTS = [
  "from-amber-100 to-orange-100 text-amber-600",
  "from-blue-100 to-indigo-100 text-blue-600",
  "from-emerald-100 to-teal-100 text-emerald-600",
  "from-purple-100 to-pink-100 text-purple-600",
  "from-rose-100 to-red-100 text-rose-600",
  "from-cyan-100 to-sky-100 text-cyan-600",
];

function StoreCard({ store, index }: { store: DashboardStoreListing; index: number }) {
  const [imgError, setImgError] = useState(false);
  const gradient = STORE_CARD_GRADIENTS[index % STORE_CARD_GRADIENTS.length];
  const hasImage = Boolean(store.storeImageUrl || store.storeImage) && !imgError;
  const imageSrc = store.storeImageUrl || store.storeImage || "";

  return (
    <Link href={`/store-management/${store.id}`} className="group block">
      <Card className="overflow-hidden rounded-xl border border-slate-200/70 p-0 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
        <div className={`relative h-40 w-full bg-gradient-to-br ${gradient} overflow-hidden`}>
          {hasImage ? (
            <Image
              src={imageSrc}
              alt={store.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <StoreIcon size={44} className="opacity-80" />
            </div>
          )}

          <Badge className="absolute top-3 right-3 bg-white/90 text-slate-800 backdrop-blur-sm hover:bg-white">
            New
          </Badge>
        </div>

        <div className="space-y-3 p-4">
          <div>
            <h3 className="group-hover:text-primary line-clamp-1 text-base font-semibold text-slate-800 transition-colors">
              {store.name}
            </h3>

            <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="line-clamp-1">
                {store.city || "City"}, {store.country || "Country"}
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 p-2.5">
            <p className="line-clamp-2 text-xs leading-5 text-slate-600">
              {store.address || "Address not specified"}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function StoreListings({ stores = [], isLoading }: StoreListingsProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-slate-200/60 shadow-sm">
      <CardHeader className="border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-base font-bold text-slate-800">New Store Listings</CardTitle>
            {stores.length > 0 && !isLoading && (
              <Badge variant="secondary" className="rounded-md text-xs font-medium">
                {stores.length} Stores
              </Badge>
            )}
          </div>
          <Button asChild size="sm" className="h-8 rounded-full px-5 text-xs font-semibold">
            <Link href="/store-management">View All</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-slate-100 p-0">
                <Skeleton className="h-40 w-full" />
                <div className="space-y-3 p-4">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : stores.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {stores.map((store, index) => (
              <StoreCard key={store.id} store={store} index={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <StoreIcon size={24} />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-700">No stores listed yet</p>
            <p className="text-xs text-slate-400">New stores will appear here once registered.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
