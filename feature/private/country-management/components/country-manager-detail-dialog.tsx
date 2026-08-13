"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CountryManagerData } from "@/constants/country-manager";
import { Eye } from "lucide-react";
import Image from "next/image";

type CountryManagerDetailDialogProps = {
  manager: CountryManagerData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DetailCard = ({ label, value }: { label: string; value?: string }) => (
  <div className="rounded-xl bg-slate-50 p-3 transition hover:bg-slate-100">
    <p className="text-xs font-medium text-slate-500">{label}</p>

    <p className="mt-1 text-sm font-semibold text-slate-900">{value || "-"}</p>
  </div>
);

export function CountryManagerDetailDialog({
  manager,
  open,
  onOpenChange,
}: CountryManagerDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl p-0">
        <DialogHeader className="border-b bg-linear-to-r from-slate-50 via-blue-50 to-indigo-50 p-6 pb-5">
          <DialogTitle className="flex items-center justify-center gap-3 text-2xl font-bold text-slate-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-sm">
              <Eye className="h-6 w-6" />
            </div>

            <span>Country Manager Details</span>
          </DialogTitle>

          <p className="mt-2 text-center text-sm text-slate-500">
            View complete profile and assigned information.
          </p>
        </DialogHeader>
        <ScrollArea className={"overflow-auto"}>
          {manager ? (
            <div className="space-y-5 p-6">
              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="bg-primary/10 text-primary flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl text-xl font-bold">
                  {manager.avatar ? (
                    <Image
                      src={manager.avatar}
                      alt={`${manager.firstName} ${manager.lastName}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    `${manager.firstName[0] ?? ""}${manager.lastName[0] ?? ""}`.toUpperCase()
                  )}
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">{`${manager.firstName} ${manager.lastName}`}</p>
                  <p className="text-sm text-slate-500">{manager.email}</p>
                </div>
              </div>

              <div className="space-y-5 bg-slate-50 p-6">
                <section className="rounded-2xl border bg-white p-5 shadow-sm">
                  <h3 className="mb-4 text-sm font-semibold tracking-wide text-slate-500 uppercase">
                    Contact Information
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <DetailCard label="Email Address" value={manager.email} />

                    <DetailCard
                      label="Phone Number"
                      value={`+${manager.phoneCode} ${manager.phoneNumber}`}
                    />
                  </div>
                </section>

                <section className="rounded-2xl border bg-white p-5 shadow-sm">
                  <h3 className="mb-4 text-sm font-semibold tracking-wide text-slate-500 uppercase">
                    Personal Details
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <DetailCard label="First Name" value={manager.firstName} />

                    <DetailCard label="Last Name" value={manager.lastName} />

                    <DetailCard label="Residential Country" value={manager.residentialCountry} />

                    <DetailCard label="State" value={manager.state} />

                    <DetailCard label="City" value={manager.city} />
                  </div>
                </section>

                <section className="rounded-2xl border bg-white p-5 shadow-sm">
                  <h3 className="mb-4 text-sm font-semibold tracking-wide text-slate-500 uppercase">
                    Address
                  </h3>

                  <div className="space-y-3">
                    <DetailCard label="Address Line 1" value={manager.address1} />

                    <DetailCard label="Address Line 2" value={manager.address2 || "-"} />
                  </div>
                </section>

                <section className="rounded-2xl border bg-white p-5 shadow-sm">
                  <h3 className="mb-4 text-sm font-semibold tracking-wide text-slate-500 uppercase">
                    Assignment
                  </h3>

                  <DetailCard label="Assigned Country" value={manager.assignedCountry} />

                  <div className="mt-4">
                    <p className="mb-2 text-xs font-medium text-slate-500">
                      Assigned City Managers
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {manager.assignedCityManagers.length ? (
                        manager.assignedCityManagers.map((city) => (
                          <span
                            key={city}
                            className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
                          >
                            {city}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-400">No city managers assigned</span>
                      )}
                    </div>
                  </div>
                </section>

                <section className="flex items-center justify-between rounded-2xl border bg-white p-5 shadow-sm">
                  <div>
                    <p className="text-xs text-slate-500">Created On</p>

                    <p className="font-medium text-slate-800">{manager.createdAt}</p>
                  </div>
                </section>
              </div>
            </div>
          ) : null}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
