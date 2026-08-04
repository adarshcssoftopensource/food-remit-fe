"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CityManagerData } from "@/constants/city-manager";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Eye,
  Globe2,
  Home,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import Image from "next/image";

type CityManagerDetailDialogProps = {
  manager: CityManagerData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string;
}) {
  return (
    <div className="group rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-md">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition group-hover:bg-slate-900 group-hover:text-white">
          <Icon className="size-3.5" />
        </span>
        <p className="text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase">{label}</p>
      </div>
      <p className="text-sm font-semibold wrap-break-word text-slate-900">{value || "—"}</p>
    </div>
  );
}

export function CityManagerDetailDialog({
  manager,
  open,
  onOpenChange,
}: CityManagerDetailDialogProps) {
  const fullName = manager ? `${manager.firstName} ${manager.lastName}` : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl gap-0 overflow-hidden border-0 p-0 shadow-2xl sm:max-h-[90vh]">
        <div className="max-h-[90vh] overflow-y-auto overscroll-contain">
          <div className="relative">
            <DialogHeader className="border-b bg-linear-to-r from-slate-50 via-cyan-50 to-blue-50 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-sm">
                  <Eye className="h-7 w-7" />
                </div>

                <div>
                  <DialogTitle className="text-2xl font-bold text-slate-800">
                    City Manager Details
                  </DialogTitle>

                  <DialogDescription className="mt-1 text-sm text-slate-500">
                    View complete profile, contact information, address, and assigned city details.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {manager ? (
              <div className="relative mt-6 px-6 sm:px-8">
                <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 p-6 backdrop-blur-sm">
                  <div className="absolute top-0 right-0 h-36 w-36 rounded-full bg-teal-100/40 blur-3xl" />

                  <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="relative mx-auto shrink-0 sm:mx-0">
                      <div className="relative h-32 w-32 overflow-hidden rounded-3xl border-2 ring-2">
                        <Image src={""} alt={fullName} fill className="object-cover" unoptimized />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1 text-center sm:text-left">
                      <h2 className="truncate text-3xl font-extrabold text-slate-900">
                        {fullName}
                      </h2>

                      <div className="mt-2 flex items-center justify-center gap-2 text-sm text-slate-500 sm:justify-start">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{manager.email}</span>
                      </div>

                      <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${
                            manager.status === "Active"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          {manager.status}
                        </span>

                        <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-xs font-semibold text-sky-700">
                          <Globe2 className="h-4 w-4" />
                          {manager.country}
                        </span>

                        <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-xs font-semibold text-violet-700">
                          <Building2 className="h-4 w-4" />
                          {manager.assignedCities.length} Cities
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {manager ? (
            <div className="space-y-6 px-6 pt-6 pb-8 sm:px-8">
              <section>
                <h3 className="mb-3 text-xs font-bold tracking-[0.16em] text-slate-400 uppercase">
                  Contact
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoTile icon={Mail} label="Email" value={manager.email} />
                  <InfoTile
                    icon={Phone}
                    label="Phone"
                    value={`+${manager.phoneCode} ${manager.phoneNumber}`}
                  />
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-xs font-bold tracking-[0.16em] text-slate-400 uppercase">
                  Residence
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <InfoTile icon={UserRound} label="Name" value={fullName} />
                  <InfoTile
                    icon={Globe2}
                    label="Residential Country"
                    value={manager.residentialCountry}
                  />
                  <InfoTile icon={MapPin} label="State" value={manager.state} />
                  <InfoTile icon={MapPin} label="City" value={manager.city} />
                  <InfoTile icon={MapPin} label="Zipcode" value={manager.zipcode} />
                  <InfoTile icon={Globe2} label="Assigned Country" value={manager.country} />
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-xs font-bold tracking-[0.16em] text-slate-400 uppercase">
                  Address
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoTile icon={Home} label="Address 1" value={manager.address1} />
                  <InfoTile icon={Home} label="Address 2" value={manager.address2} />
                </div>
              </section>

              <section className="overflow-hidden rounded-3xl border border-teal-100 bg-linear-to-br from-teal-50 via-white to-cyan-50 p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-xs font-bold tracking-[0.16em] text-teal-700 uppercase">
                    Assigned Cities
                  </h3>
                  <span className="rounded-full bg-teal-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
                    {manager.assignedCities.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {manager.assignedCities.length ? (
                    manager.assignedCities.map((city) => (
                      <span
                        key={city}
                        className="rounded-full border border-teal-200/80 bg-white px-3.5 py-1.5 text-sm font-semibold text-teal-900 shadow-sm"
                      >
                        {city}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400">No cities assigned</span>
                  )}
                </div>
              </section>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
                  <CalendarDays className="size-4" />
                </span>
                <div>
                  <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">
                    Created On
                  </p>
                  <p className="text-sm font-semibold text-slate-800">{manager.createdAt}</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
