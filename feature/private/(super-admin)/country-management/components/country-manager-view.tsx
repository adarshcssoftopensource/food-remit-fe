"use client";

import { CountryManagerViewPageProps } from "@/app/(private)/(super-admin)/country-management/[id]/page";
import { ImageLightbox } from "@/components/common/image-lightbox";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { DetailCard } from "@/feature/private/(super-admin)/city-management/components/shared/detail-card";
import { ManagerViewHero } from "@/feature/private/(super-admin)/city-management/components/shared/manager-view-hero";
import {
  ManagerContactSection,
  ManagerPersonalSection,
} from "@/feature/private/(super-admin)/city-management/components/shared/manager-view-sections";
import { useGetCountryManager } from "@/feature/private/(super-admin)/country-management/hooks/use-get-country-manager";
import { Globe2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import ViewPageLoading from "./view-page-loading";

export default function CountryManagerViewPage({ params }: CountryManagerViewPageProps) {
  const router = useRouter();
  const { id } = use(params);

  const { data: manager, isLoading } = useGetCountryManager(id);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  if (isLoading) {
    return <ViewPageLoading />;
  }

  if (!manager) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-slate-500">Country Manager not found.</p>
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
          { label: "Country Management", href: ROUTES.ADMIN.COUNTRY_MANAGEMENT.LIST },
          { label: "Country Manager Details" },
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
            <DetailCard label="Assigned Country" value={manager.assignCountryName} />
            <div className="mt-6">
              <p className="mb-3 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                Assigned City Managers
              </p>
              {manager.cityManagers && manager.cityManagers.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {manager.cityManagers.map((cm) => (
                    <div
                      key={cm.id}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:bg-slate-100"
                    >
                      <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-bold">
                        {cm.image ? (
                          <Image
                            src={cm.image}
                            alt={`${cm.firstName} ${cm.lastName}`}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          `${cm.firstName[0] ?? ""}${cm.lastName[0] ?? ""}`.toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {cm.firstName} {cm.lastName}
                        </p>
                        <p className="truncate text-xs text-slate-500">{cm.email}</p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                          cm.managerStatus === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {cm.managerStatus}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">No city managers assigned</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
