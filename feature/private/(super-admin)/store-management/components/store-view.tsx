"use client";

import { StoreViewPageProps } from "@/app/(private)/(super-admin)/store-management/[id]/page";
import { ImageLightbox } from "@/components/common/image-lightbox";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { AdditionalDocumentsCard } from "@/feature/private/(store-admin)/partner-leads/components/cards/additional-documents-card";
import { BankVerificationCard } from "@/feature/private/(store-admin)/partner-leads/components/cards/bank-verification-card";
import { KycVerificationCard } from "@/feature/private/(store-admin)/partner-leads/components/cards/kyc-verification-card";
import { LocationDetailsCard } from "@/feature/private/(store-admin)/partner-leads/components/cards/location-details-card";
import { OperationalPreferencesCard } from "@/feature/private/(store-admin)/partner-leads/components/cards/operational-preferences-card";
import { ViewStatusMeta } from "@/feature/private/(super-admin)/city-management/components/shared/view-status-meta";
import { useGetStore } from "@/feature/private/(super-admin)/store-management/hooks/use-get-stores";
import { formatDate } from "@/lib/date";
import { formatAddress } from "@/lib/utils";
import { Building2, Expand, Mail, MapPin, Phone, UserCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import StoreScaltonLoading from "./store-scalton-loading";

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 border-b border-slate-50 py-2.5 last:border-0 sm:flex-row sm:items-start sm:gap-4 sm:py-3">
      <span className="shrink-0 text-[11px] font-semibold tracking-wide text-slate-400 uppercase sm:min-w-32.5 sm:text-xs">
        {label}
      </span>
      <span className="min-w-0 flex-1 text-sm font-medium break-words text-slate-700">{value}</span>
    </div>
  );
}

export default function StoreViewPage({ params }: StoreViewPageProps) {
  const router = useRouter();
  const { id } = use(params);

  const { data: store, isLoading } = useGetStore(id);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

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

  const storeFullAddress = formatAddress(
    [store.storeAddress, store.address2, store.managerZipCode].filter(Boolean).join(", "),
  );
  const managerFullAddress = formatAddress(
    [store.managerAddress, store.managerState, store.managerCountry, store.managerZipCode]
      .filter(Boolean)
      .join(", "),
  );
  return (
    <div>
      <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />

      <PageHeader
        breadcrumbs={[
          { label: "Store Management", href: ROUTES.ADMIN.STORE_MANAGEMENT.ROOT },
          { label: "Store Details" },
        ]}
      />

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="from-primary/5 via-background to-primary/5 border-b bg-linear-to-r px-4 py-5 sm:px-8 sm:py-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex min-w-0 items-center gap-4 sm:gap-6">
              <div className="group bg-primary/10 ring-primary/5 relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl ring-4 sm:h-20 sm:w-20 sm:rounded-2xl">
                {store.storeImage ? (
                  <>
                    <Image
                      src={store.storeImage}
                      alt={store.storeName}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <Button
                      variant="ghost"
                      onClick={() => setLightboxSrc(store.storeImage || null)}
                      className="absolute right-1 bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 hover:scale-110"
                      title="View full screen"
                    >
                      <Expand className="h-3 w-3" />
                    </Button>
                  </>
                ) : (
                  <Building2 className="text-primary h-8 w-8 sm:h-10 sm:w-10" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <h1 className="text-xl font-bold tracking-tight break-words text-slate-900 sm:text-3xl">
                    {store.storeName}
                  </h1>
                  {store.storeId && (
                    <span className="inline-flex items-center rounded-lg border border-slate-200 bg-white/90 px-2.5 py-1 font-mono text-xs font-semibold text-slate-700 shadow-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      Store ID: {store.storeId}
                    </span>
                  )}
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500 sm:mt-2 sm:text-sm">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="line-clamp-1">{storeFullAddress || "No address provided"}</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
              <ViewStatusMeta
                status={store.status}
                dateLabel="Added On"
                dateValue={formatDate(store.createdAt)}
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2">
          {/* Store Details Section */}
          <div className="border-b border-slate-100 p-4 sm:p-6 md:border-r md:border-b-0 md:p-8">
            <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-800 sm:mb-6 sm:text-lg">
              <Building2 className="h-5 w-5 shrink-0 text-emerald-600" />
              Store Information
            </h3>
            <div className="divide-y divide-slate-100">
              <InfoRow
                label="Store ID"
                value={
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                    {store.storeId || "—"}
                  </span>
                }
              />
              <InfoRow
                label="Phone"
                value={
                  <span className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 sm:text-sm">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                    {store.storePhoneCode} {store.storePhoneNumber}
                  </span>
                }
              />
              <InfoRow
                label="Government Store Tax"
                value={
                  <span className="font-semibold text-slate-700">{store.storeTax.toFixed(2)}%</span>
                }
              />
              {store.foodRemitCommission !== undefined && store.foodRemitCommission !== null && (
                <InfoRow
                  label="Commission"
                  value={
                    <span className="bg-primary/10 text-primary rounded-lg px-2.5 py-1 text-xs font-bold sm:px-3 sm:text-sm">
                      {store.foodRemitCommission.toFixed(2)}%
                    </span>
                  }
                />
              )}
              <InfoRow label="Country" value={store.storeCountryName} />
              <InfoRow label="City" value={store.storeCityName} />
            </div>
          </div>

          {/* Manager Details Section */}
          <div className="p-4 sm:p-6 md:p-8">
            <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-800 sm:mb-6 sm:text-lg">
              <UserCircle className="h-5 w-5 shrink-0 text-emerald-600" />
              Manager Information
            </h3>

            <div className="mb-4 flex items-center gap-3 sm:mb-6 sm:gap-4">
              <div className="group relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-slate-100 sm:h-16 sm:w-16">
                {store.managerImage ? (
                  <>
                    <Image
                      src={store.managerImage}
                      alt={managerName}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                    <Button
                      variant="ghost"
                      onClick={() => setLightboxSrc(store.managerImage || null)}
                      className="absolute right-0 bottom-0 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-colors duration-200 group-hover:opacity-100 hover:scale-110 hover:bg-black/70"
                      title="View full screen"
                    >
                      <Expand className="h-2.5 w-2.5" />
                    </Button>
                  </>
                ) : (
                  <div className="from-primary/10 to-primary/15 text-primary flex h-full w-full items-center justify-center bg-linear-to-br text-lg font-bold sm:text-xl">
                    {`${store.managerFirstName[0]}${store.managerLastName[0]}`.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-800 sm:text-base">
                  {managerName}
                </p>
                <p className="text-xs text-slate-500 sm:text-sm">Store Manager</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              <InfoRow
                label="Email"
                value={
                  <a
                    href={`mailto:${store.managerEmail}`}
                    className="inline-flex items-center gap-1.5 break-all text-emerald-700 hover:underline"
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="break-all">{store.managerEmail}</span>
                  </a>
                }
              />
              <InfoRow
                label="Phone"
                value={
                  <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span>
                      {store.managerPhoneCode} {store.managerPhoneNumber}
                    </span>
                  </span>
                }
              />
              <InfoRow
                label="Address"
                value={
                  <span className="flex items-start gap-1.5 text-xs break-words sm:text-sm">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="break-words">{managerFullAddress}</span>
                  </span>
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <OperationalPreferencesCard
            lead={store.partnerLead}
            storeSameDayDelivery={store.sameDayDelivery}
            storeOrderProcessingTime={store.orderProcessingTime}
            storePerishableProducts={store.perishableProducts}
            storeRefrigeratedProducts={store.refrigeratedProducts}
            storeFrozenProducts={store.frozenProducts}
          />
        </div>
        {store.partnerLead && <KycVerificationCard lead={store.partnerLead} />}
        {store.partnerLead && <BankVerificationCard lead={store.partnerLead} />}
        {store.partnerLead && <AdditionalDocumentsCard lead={store.partnerLead} />}
        {store.partnerLead && <LocationDetailsCard lead={store.partnerLead} />}
      </div>
    </div>
  );
}
