"use client";

import Image from "next/image";
import { Building2, MapPin, Phone, Mail, User, ZoomIn } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { CreditsCustomer, CreditsStore } from "../types/credits.types";

interface CreditPartiesCardProps {
  customer: CreditsCustomer;
  store: CreditsStore;
  onImageClick?: (url: string) => void;
}

const isUuid = (str?: string | null) =>
  Boolean(
    str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str.trim()),
  );

export function CreditPartiesCard({ customer, store, onImageClick }: CreditPartiesCardProps) {
  const customerInitials = (customer.name || "Customer").slice(0, 2).toUpperCase();
  const storeInitials = (store.name || "Store").slice(0, 2).toUpperCase();

  const validCity = !isUuid(store.city) ? store.city : "";
  const validCountry = !isUuid(store.country) ? store.country : "";
  const cityCountry = [validCity, validCountry].filter(Boolean).join(", ");
  const cleanAddress = store.address && !isUuid(store.address) ? store.address : "";
  const cleanFullAddress = store.fullAddress && !isUuid(store.fullAddress) ? store.fullAddress : "";
  const storeDisplayAddress = cleanAddress || cleanFullAddress || cityCountry || "Location N/A";

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* Customer Card */}
      <Card className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-xs backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <User className="size-3.5" />
            </div>
            <span className="text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
              Customer Information
            </span>
          </div>
          <Badge
            variant="outline"
            className="border-indigo-200 bg-indigo-50/70 text-[10px] font-semibold text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-950/20 dark:text-indigo-400"
          >
            Payer & Recipient
          </Badge>
        </div>

        <div className="flex items-start gap-3.5">
          {/* Avatar with ImageLightbox trigger */}
          <div
            className={`group relative size-12 shrink-0 overflow-hidden rounded-full ring-2 ring-slate-100 dark:ring-slate-800 ${
              customer.avatar ? "cursor-pointer" : ""
            }`}
            onClick={() => customer.avatar && onImageClick?.(customer.avatar)}
            title={customer.avatar ? "Click to maximize image" : undefined}
          >
            {customer.avatar ? (
              <>
                <Image
                  src={customer.avatar}
                  alt={customer.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity group-hover:opacity-100">
                  <ZoomIn className="size-3.5 text-white" />
                </div>
              </>
            ) : (
              <div className="flex size-full items-center justify-center bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {customerInitials}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white">
              {customer.name}
            </h3>

            {customer.email && (
              <p className="flex items-center gap-1.5 truncate text-xs text-slate-500">
                <Mail className="size-3 shrink-0 text-slate-400" />
                <span className="truncate">{customer.email}</span>
              </p>
            )}

            {customer.phoneNumber && (
              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                <Phone className="size-3 shrink-0 text-slate-400" />
                <span>{customer.phoneNumber}</span>
              </p>
            )}

            {customer.address && (
              <p className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-400">
                <MapPin className="size-3 shrink-0 text-slate-400" />
                <span className="truncate">{customer.address}</span>
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Store Card */}
      <Card className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-xs backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <Building2 className="size-3.5" />
            </div>
            <span className="text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
              Store Information
            </span>
          </div>
          <Badge
            variant="outline"
            className="border-emerald-200 bg-emerald-50/70 text-[10px] font-semibold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-400"
          >
            Fulfillment Store
          </Badge>
        </div>

        <div className="flex items-start gap-3.5">
          {/* Store Logo with ImageLightbox trigger */}
          <div
            className={`group relative size-12 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 ring-1 ring-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:ring-slate-700 ${
              store.image ? "cursor-pointer" : ""
            }`}
            onClick={() => store.image && onImageClick?.(store.image)}
            title={store.image ? "Click to maximize image" : undefined}
          >
            {store.image ? (
              <>
                <Image
                  src={store.image}
                  alt={store.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity group-hover:opacity-100">
                  <ZoomIn className="size-3.5 text-white" />
                </div>
              </>
            ) : (
              <div className="flex size-full items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                {storeInitials}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white">
              {store.name}
            </h3>

            <p className="flex items-start gap-1.5 text-xs text-slate-500">
              <MapPin className="mt-0.5 size-3.5 shrink-0 text-slate-400" />
              <span className="line-clamp-2 leading-relaxed" title={storeDisplayAddress}>
                {storeDisplayAddress}
              </span>
            </p>

            <div className="flex items-center gap-4 pt-1 text-[11px] text-slate-500">
              <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium dark:bg-slate-800">
                Store Tax: {store.storeTaxPercent || "5%"}
              </span>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium dark:bg-slate-800">
                Commission: {store.commissionPercent || "0%"}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
