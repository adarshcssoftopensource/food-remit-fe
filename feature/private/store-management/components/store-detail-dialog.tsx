"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type StoreData } from "@/constants/store-management";
import { Building2, Mail, MapPin, Phone, UserCircle } from "lucide-react";
import Image from "next/image";

interface StoreDetailDialogProps {
  store: StoreData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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

export function StoreDetailDialog({ store, open, onOpenChange }: StoreDetailDialogProps) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl p-0">
        <DialogHeader className="from-primary/5 via-background to-primary/5 border-b bg-gradient-to-r px-8 py-6">
          <div className="flex items-center gap-5">
            <div className="bg-primary/10 ring-primary/5 relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl ring-4">
              {store.storeImage ? (
                <Image src={store.storeImage} alt={store.storeName} fill className="object-cover" />
              ) : (
                <Building2 className="text-primary h-8 w-8" />
              )}
            </div>

            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold tracking-tight">
                {store.storeName}
              </DialogTitle>

              <DialogDescription className="mt-1 flex items-center gap-3">
                <span className="text-muted-foreground">Store Details & Manager Information</span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    store.status === "Active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {store.status}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-0 lg:grid-cols-2">
          <div className="border-b border-slate-100 p-6 lg:border-r lg:border-b-0">
            <div className="mb-6 flex flex-col items-center gap-3 text-center">
              <div className="relative size-24 overflow-hidden rounded-2xl">
                {store.storeImage ? (
                  <Image
                    src={store.storeImage}
                    alt={store.storeName}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <div className="from-primary/10 to-primary/15 text-primary flex size-full items-center justify-center bg-linear-to-br text-xl font-bold">
                    {store.storeName
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-800">{store.storeName}</h2>
                <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      store.status === "Active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${store.status === "Active" ? "bg-emerald-500" : "bg-red-500"}`}
                    />
                    {store.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="from-primary/5 flex items-center gap-3 border-b border-slate-100 bg-linear-to-r to-white px-5 py-4">
                <div className="bg-primary/15 flex size-9 items-center justify-center rounded-xl">
                  <Building2 className="text-primary size-5" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800">Store Information</h3>
                  <p className="text-xs text-slate-500">
                    Basic store details and commission settings
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-100 px-5">
                <InfoRow
                  label="Store Address"
                  value={
                    <a
                      href="#"
                      className="text-sm font-medium text-blue-600 transition hover:text-blue-700 hover:underline"
                    >
                      {storeFullAddress}
                    </a>
                  }
                />

                <InfoRow
                  label="Phone"
                  value={
                    <span className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-medium text-slate-700">
                      <Phone className="size-3.5 text-slate-500" />
                      {store.storePhoneCode} {store.storePhoneNumber}
                    </span>
                  }
                />

                <InfoRow
                  label="Store Tax"
                  value={
                    <span className="font-semibold text-slate-700">
                      {store.storeTax.toFixed(2)}%
                    </span>
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

                <InfoRow label="City" value={store.storeCity} />

                <InfoRow label="Country" value={store.storeCountry} />
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6 flex flex-col items-center gap-3 text-center">
              <div className="relative size-24 overflow-hidden rounded-2xl">
                {store.managerImage ? (
                  <Image
                    src={store.managerImage}
                    alt={managerName}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <div className="from-primary/10 to-primary/15 text-primary flex size-full items-center justify-center bg-linear-to-br text-xl font-bold">
                    {`${store.managerFirstName[0]}${store.managerLastName[0]}`.toUpperCase()}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800">Store Manager</h3>
                <p className="text-sm text-slate-500">{managerName}</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="from-primary/5 flex items-center gap-3 border-b border-slate-100 bg-linear-to-r to-white px-4 px-5 py-4">
                <div className="bg-primary/15 flex size-9 items-center justify-center rounded-xl">
                  <UserCircle className="size-4 text-blue-500" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800">Manager Information</h3>
                  <p className="text-xs text-slate-500">
                    Basic store details and commission settings
                  </p>
                </div>
              </div>
              <div className="divide-y divide-slate-100 px-5">
                <InfoRow label="Full Name" value={managerName} />
                <InfoRow
                  label="Email"
                  value={
                    <a
                      href={`mailto:${store.managerEmail}`}
                      className="flex items-center gap-1.5 text-blue-600 hover:underline"
                    >
                      <Mail className="size-3 text-slate-400" />
                      {store.managerEmail}
                    </a>
                  }
                />
                <InfoRow
                  label="Phone"
                  value={
                    <span className="flex items-center gap-1.5">
                      <Phone className="size-3 text-slate-400" />
                      {store.managerPhoneCode} {store.managerPhoneNumber}
                    </span>
                  }
                />
                <InfoRow
                  label="Address"
                  value={
                    <span className="flex items-start gap-1.5">
                      <MapPin className="mt-0.5 size-3 shrink-0 text-slate-400" />
                      {managerFullAddress}
                    </span>
                  }
                />
                <InfoRow label="City" value={store.managerCity} />
                <InfoRow label="Country" value={store.managerCountry} />
                {store.managerZipCode && <InfoRow label="Zip Code" value={store.managerZipCode} />}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
