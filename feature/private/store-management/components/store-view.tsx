"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Building2, Mail, MapPin, Phone, UserCircle, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useGetStore } from "@/feature/private/store-management/hooks/use-get-stores";
import { formatDate } from "@/lib/date";
import { StoreViewPageProps } from "@/app/(private)/store-management/[id]/page";
import StoreScaltonLoading from "./store-scalton-loading";

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 border-b border-slate-50 py-3 last:border-0">
      <span className="min-w-32.5 text-xs font-semibold tracking-wide text-slate-400 uppercase">
        {label}
      </span>
      <span className="flex-1 text-sm font-medium text-slate-700">{value}</span>
    </div>
  );
}

export default function StoreViewPage({ params }: StoreViewPageProps) {
  const router = useRouter();
  const { id } = use(params);

  const { data: store, isLoading } = useGetStore(id);

  if (isLoading) {
    return <StoreScaltonLoading />;
  }

  if (!store) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-slate-500">Store not found.</p>
        <Button onClick={() => router.back()} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  const managerName = `${store.managerFirstName} ${store.managerLastName}`;

  const storeFullAddress = [store.storeAddress, store.address2, store.storeCountry]
    .filter(Boolean)
    .join(", ");
  const managerFullAddress = [
    store.managerAddress,
    store.managerState,
    store.managerCountry,
    store.managerZipCode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div>
      <Button
        variant="secondary"
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Stores
      </Button>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="from-primary/5 via-background to-primary/5 border-b bg-linear-to-r px-8 py-8">
          <div className="flex items-center gap-6">
            <div className="bg-primary/10 ring-primary/5 relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl ring-4">
              {store.storeImage ? (
                <Image src={store.storeImage} alt={store.storeName} fill className="object-cover" />
              ) : (
                <Building2 className="text-primary h-10 w-10" />
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {store.storeName}
              </h1>
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="line-clamp-1">{storeFullAddress || "No address provided"}</span>
              </div>
            </div>

            <div className="flex shrink-0 gap-3 text-right">
              <div>
                <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  Status
                </p>
                <p className="mt-0.5 font-medium text-slate-700">{store.status}</p>
              </div>
              <div className="w-px bg-slate-200" />
              <div>
                <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  Added On
                </p>
                <p className="mt-0.5 font-medium text-slate-700">{formatDate(store.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2">
          {/* Store Details Section */}
          <div className="border-r border-slate-100 p-8">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Building2 className="h-5 w-5 text-blue-500" />
              Store Information
            </h3>
            <div className="divide-y divide-slate-100">
              <InfoRow
                label="Phone"
                value={
                  <span className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-medium text-slate-700">
                    <Phone className="h-3.5 w-3.5 text-slate-500" />
                    {store.storePhoneCode} {store.storePhoneNumber}
                  </span>
                }
              />
              <InfoRow
                label="Store Tax"
                value={
                  <span className="font-semibold text-slate-700">{store.storeTax.toFixed(2)}%</span>
                }
              />
              <InfoRow
                label="Commission"
                value={
                  <span className="bg-primary/10 text-primary rounded-lg px-3 py-1 text-sm font-bold">
                    {store.foodRemitCommission.toFixed(2)}%
                  </span>
                }
              />
              <InfoRow label="City" value={store.storeCityName} />
              <InfoRow label="Country" value={store.storeCountryName} />
            </div>
          </div>

          <div className="p-8">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-800">
              <UserCircle className="h-5 w-5 text-blue-500" />
              Manager Information
            </h3>

            <div className="mb-6 flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-slate-100">
                {store.managerImage ? (
                  <Image
                    src={store.managerImage}
                    alt={managerName}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="from-primary/10 to-primary/15 text-primary flex h-full w-full items-center justify-center bg-linear-to-br text-xl font-bold">
                    {`${store.managerFirstName[0]}${store.managerLastName[0]}`.toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold text-slate-800">{managerName}</p>
                <p className="text-sm text-slate-500">Store Manager</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              <InfoRow
                label="Email"
                value={
                  <a
                    href={`mailto:${store.managerEmail}`}
                    className="flex items-center gap-1.5 text-blue-600 hover:underline"
                  >
                    <Mail className="h-3 w-3 text-slate-400" />
                    {store.managerEmail}
                  </a>
                }
              />
              <InfoRow
                label="Phone"
                value={
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-slate-400" />
                    {store.managerPhoneCode} {store.managerPhoneNumber}
                  </span>
                }
              />
              <InfoRow
                label="Address"
                value={
                  <span className="flex items-start gap-1.5">
                    <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-slate-400" />
                    {managerFullAddress}
                  </span>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
