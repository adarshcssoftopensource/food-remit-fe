"use client";

import { CityManagerViewPageProps } from "@/app/(private)/(super-admin)/city-management/[id]/page";
import { ImageLightbox } from "@/components/common/image-lightbox";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/config/routes";
import { useGetCityManager } from "@/feature/private/(super-admin)/city-management/hooks/use-get-city-manager";
import { useGetStores } from "@/feature/private/(super-admin)/store-management/hooks/use-get-stores";
import { Globe2, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { DetailCard } from "./shared/detail-card";
import { ManagerViewHero } from "./shared/manager-view-hero";
import { ManagerContactSection, ManagerPersonalSection } from "./shared/manager-view-sections";
import ViewDataLoading from "./view-data.loading";

export default function CityManagerViewPage({ params }: CityManagerViewPageProps) {
  const router = useRouter();
  const { id } = use(params);

  const { data: manager, isLoading } = useGetCityManager(id);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const { data: storesResponse, isLoading: isStoresLoading } = useGetStores({ limit: 1000 });
  const assignedStores = (storesResponse || []).filter((store) => store.assignedCityManager === id);

  if (isLoading) {
    return <ViewDataLoading />;
  }

  if (!manager) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-slate-500">City Manager not found.</p>
        <Button onClick={() => router.back()} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  const managerFullAddress = [
    manager.address1,
    manager.address2,
    manager.state,
    manager.residentialCountry,
    manager.zipcode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div>
      <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />

      <PageHeader
        breadcrumbs={[
          { label: "City Management", href: ROUTES.ADMIN.CITY_MANAGEMENT.LIST },
          { label: "City Manager Details" },
        ]}
      />

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <ManagerViewHero manager={manager} onImageExpand={setLightboxSrc} />

        <div className="space-y-6 p-8">
          <ManagerContactSection manager={manager} />

          <ManagerPersonalSection manager={manager} fullAddress={managerFullAddress} />

          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wide text-slate-500 uppercase">
              <Globe2 className="h-4 w-4 text-emerald-600" />
              Assignment
            </h3>
            <DetailCard label="Assigned Country" value={manager.countryName} />
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium text-slate-500">Assigned Cities</p>
              <div className="flex flex-wrap gap-2">
                {manager.assignedCityNames.length ? (
                  manager.assignedCityNames.map((city) => (
                    <span
                      key={city}
                      className="border-primary-100 bg-primary-50 text-primary-700 rounded-full border px-3 py-1 text-sm font-medium shadow-xs"
                    >
                      {city}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400">No cities assigned</span>
                )}
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-6">
              <p className="mb-3 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <Store className="h-4 w-4" />
                Assigned Stores
              </p>
              {isStoresLoading ? (
                <Skeleton className="h-10 w-full rounded-xl" />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {assignedStores.length ? (
                    assignedStores.map((store) => (
                      <Button
                        variant={"ghost"}
                        key={store.id}
                        type="button"
                        className="border-primary-100 bg-primary-50 text-primary-700 cursor-pointer rounded-full border px-3 py-1 text-sm font-medium shadow-xs"
                        onClick={() => router.push(`${ROUTES.ADMIN.STORE_MANAGEMENT.ROOT}`)}
                      >
                        {store.storeName}
                      </Button>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400">No stores assigned</span>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
