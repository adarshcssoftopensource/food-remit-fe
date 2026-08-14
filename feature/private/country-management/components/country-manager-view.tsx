"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Mail, UserCircle, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCountryManager } from "@/feature/private/country-management/hooks/use-get-country-manager";
import { formatDate } from "@/lib/date";
import { CountryManagerViewPageProps } from "@/app/(private)/country-management/[id]/page";
import ViewPageLoading from "./view-page-loading";

const DetailCard = ({ label, value }: { label: string; value?: string }) => (
  <div className="rounded-xl bg-slate-50 p-3 transition hover:bg-slate-100">
    <p className="text-xs font-medium text-slate-500">{label}</p>
    <p className="mt-1 text-sm font-semibold text-slate-900">{value || "-"}</p>
  </div>
);

export default function CountryManagerViewPage({ params }: CountryManagerViewPageProps) {
  const router = useRouter();
  const { id } = use(params);

  const { data: manager, isLoading } = useGetCountryManager(id);

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
      <Button
        variant="secondary"
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Country Managers
      </Button>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b bg-linear-to-r from-slate-50 via-blue-50 to-indigo-50 p-8 pb-8">
          <div className="flex items-center gap-6">
            <div className="bg-primary/10 text-primary flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl text-2xl font-bold shadow-sm">
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
              <UserCircle className="h-4 w-4 text-blue-500" />
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
              <UserCircle className="h-4 w-4 text-blue-500" />
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
              <Globe2 className="h-4 w-4 text-blue-500" />
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
