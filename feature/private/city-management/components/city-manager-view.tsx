"use client";

import { CityManagerViewPageProps } from "@/app/(private)/city-management/[id]/page";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/common/page-header";
import { ROUTES } from "@/config/routes";
import { useGetCityManager } from "@/feature/private/city-management/hooks/use-get-city-manager";
import { useGetStores } from "@/feature/private/store-management/hooks/use-get-stores";
import { formatDate } from "@/lib/date";
import { ArrowLeft, Globe2, Store, UserCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use } from "react";
import ViewDataLoading from "./view-data.loading";

const DetailCard = ({ label, value }: { label: string; value?: string }) => (
  <div className="rounded-xl bg-slate-50 p-3 transition hover:bg-slate-100">
    <p className="text-xs font-medium text-slate-500">{label}</p>
    <p className="mt-1 text-sm font-semibold text-slate-900">{value || "-"}</p>
  </div>
);

export default function CityManagerViewPage({ params }: CityManagerViewPageProps) {
  const router = useRouter();
  const { id } = use(params);

  const { data: manager, isLoading } = useGetCityManager(id);

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
      <PageHeader
        breadcrumbs={[
          { label: "City Management", href: ROUTES.ADMIN.CITY_MANAGEMENT.LIST },
          { label: "City Manager Details" },
        ]}
      />

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-emerald-100/60 bg-linear-to-r from-emerald-50/70 via-teal-50/30 to-emerald-50/40 p-8 pb-8">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-emerald-500/10 text-2xl font-bold text-emerald-700 shadow-sm ring-1 ring-emerald-500/20">
              {manager.image ? (
                <Image
                  src={manager.image}
                  alt={`${manager.firstName} ${manager.lastName}`}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              ) : (
                `${manager.firstName[0] ?? ""}${manager.lastName[0] ?? ""}`.toUpperCase()
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900">
                {`${manager.firstName} ${manager.lastName}`}
              </h1>
            </div>

            <div className="flex shrink-0 gap-3 text-right">
              <div>
                <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  Status
                </p>
                <p className="mt-0.5 font-medium text-slate-700">{manager.status}</p>
              </div>
              <div className="w-px bg-slate-200" />
              <div>
                <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  Created On
                </p>
                <p className="mt-0.5 font-medium text-slate-700">{formatDate(manager.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-8">
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wide text-slate-500 uppercase">
              <UserCircle className="h-4 w-4 text-emerald-600" />
              Contact Information
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <DetailCard label="Email Address" value={manager.email} />
              <DetailCard
                label="Phone Number"
                value={`${manager.phoneCode} ${manager.phoneNumber}`}
              />
            </div>
          </section>

          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wide text-slate-500 uppercase">
              <UserCircle className="h-4 w-4 text-emerald-600" />
              Personal Details
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <DetailCard label="First Name" value={manager.firstName} />
              <DetailCard label="Last Name" value={manager.lastName} />
              <DetailCard label="Residential Country" value={manager.residentialCountry} />
              <DetailCard label="State" value={manager.state} />
              <DetailCard label="City" value={manager.city} />
              <DetailCard label="Address" value={managerFullAddress} />
            </div>
          </section>

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
                      <span
                        key={store.id}
                        className="border-primary-100 bg-primary-50 text-primary-700 cursor-pointer rounded-full border px-3 py-1 text-sm font-medium shadow-xs"
                        onClick={() => router.push(`${ROUTES.ADMIN.STORE_MANAGEMENT.ROOT}`)}
                      >
                        {store.storeName}
                      </span>
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
