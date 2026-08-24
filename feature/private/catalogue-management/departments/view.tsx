"use client";

import { ImageLightbox } from "@/components/common/image-lightbox";
import { PageHeader } from "@/components/common/page-header";
import { ScopeBadge } from "@/components/common/scope-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import { formatDate } from "@/lib/date";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  Expand,
  Layers,
  MapPin,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGetDepartment } from "./hooks/use-get-department";

interface DepartmentViewProps {
  id: string;
}

export function DepartmentView({ id }: DepartmentViewProps) {
  const router = useRouter();
  const { data: department, isLoading } = useGetDepartment(id);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-8 w-64 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="animate-pulse overflow-hidden border-slate-200/80 lg:col-span-1 dark:border-slate-800">
            <div className="h-32 bg-slate-200 dark:bg-slate-800" />
            <div className="px-6 pt-0 pb-6 text-center">
              <div className="mx-auto -mt-12 h-24 w-24 rounded-3xl bg-slate-300 ring-4 ring-white dark:bg-slate-700 dark:ring-slate-950" />
              <div className="mx-auto mt-4 h-6 w-32 rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="mx-auto mt-3 h-5 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
          </Card>
          <Card className="animate-pulse border-slate-200/80 lg:col-span-2 dark:border-slate-800">
            <CardHeader className="h-20 border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/20" />
            <CardContent className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-24 rounded-xl bg-slate-100 dark:bg-slate-800/50" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <Building2 className="h-16 w-16 text-slate-300" />
        <h2 className="text-2xl font-bold tracking-tight text-slate-700">Department not found</h2>
        <Button onClick={() => router.back()} variant="outline" className="mt-2 rounded-full px-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <>
      <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />

      <div className="space-y-6">
        <div>
          <PageHeader
            breadcrumbs={[
              { label: "Catalogue Management" },
              { label: "Departments", href: ROUTES.ADMIN.CATALOGUE_MANAGEMENT.DEPARTMENTS },
              { label: "Department Details" },
            ]}
          />
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 grid gap-6 transition-colors duration-700 lg:grid-cols-3">
          <Card className="relative flex h-fit flex-col overflow-hidden rounded-2xl border-0 bg-white shadow-xl shadow-slate-200/40 lg:col-span-1 dark:bg-slate-950 dark:shadow-none">
            <div className="from-primary/80 via-primary to-primary/40 absolute inset-x-0 top-0 h-32 bg-linear-to-br opacity-90" />

            <CardHeader className="relative flex flex-1 flex-col px-6 pt-2 pb-8 text-center">
              <div className="shadow-primary/20 mx-auto flex h-60 w-60 shrink-0 items-center justify-center rounded-[3rem] bg-white p-3 shadow-xl ring-4 ring-white transition-transform duration-500 hover:scale-105 dark:bg-slate-900 dark:ring-slate-950">
                <div className="bg-primary/5 text-primary group relative flex h-full w-full items-center justify-center overflow-hidden rounded-[2.5rem]">
                  {department.departmentIcon ? (
                    <>
                      <Image
                        key={department.id}
                        src={department.departmentIcon}
                        alt={department.departmentName}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                      <Button
                        variant={"ghost"}
                        onClick={() => setLightboxSrc(department.departmentIcon || "")}
                        className="absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-colors transition-opacity transition-transform duration-200 group-hover:opacity-100 hover:scale-110 hover:bg-black/70"
                        title="View full screen"
                      >
                        <Expand className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Building2 className="h-20 w-20" />
                  )}
                </div>
              </div>

              <div className="mt-10 w-full text-center">
                <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {department.departmentName}
                </CardTitle>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold shadow-sm backdrop-blur-sm transition-colors ${
                      department.status === "ACTIVE"
                        ? "bg-green-500/10 text-green-700 ring-1 ring-green-500/20 dark:bg-green-500/20 dark:text-green-400"
                        : "bg-red-500/10 text-red-700 ring-1 ring-red-500/20 dark:bg-red-500/20 dark:text-red-400"
                    }`}
                  >
                    <span className="relative flex h-2 w-2">
                      <span
                        className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${department.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"}`}
                      ></span>
                      <span
                        className={`relative inline-flex h-2 w-2 rounded-full ${department.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"}`}
                      ></span>
                    </span>
                    {department.status === "ACTIVE" ? "Active" : "Inactive"}
                  </span>
                  <ScopeBadge
                    isGlobal={department.isGlobal}
                    scopeLabel={department.scopeLabel}
                    cityName={department.city?.name || department.cityName}
                  />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="rounded-2xl border-0 bg-white shadow-xl shadow-slate-200/40 lg:col-span-2 dark:bg-slate-950 dark:shadow-none">
            <CardHeader className="border-b border-slate-100/80 px-8 py-6 dark:border-slate-800/80">
              <CardTitle className="flex items-center gap-3 text-lg font-bold text-slate-900 dark:text-white">
                <div className="bg-primary h-5 w-1.5 rounded-full" />
                Information Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <InfoCard
                  icon={<MapPin className="h-5 w-5" />}
                  label="Country"
                  value={department.country?.name || department.countryName || "Unknown"}
                />
                <InfoCard
                  icon={<Layers className="h-5 w-5" />}
                  label="Parent Department"
                  value={
                    department.parentDepartmentName || department.parent?.departmentName || "None"
                  }
                />
                <InfoCard
                  icon={<MapPin className="h-5 w-5" />}
                  label="Scope"
                  value={
                    department.scopeLabel ||
                    (department.city?.name || department.cityName
                      ? `City · ${department.city?.name || department.cityName}`
                      : "Global (All Cities)")
                  }
                />
                <InfoCard
                  icon={<User className="h-5 w-5" />}
                  label="Created By"
                  value={department.createdBy || "System"}
                />
                <InfoCard
                  icon={<Calendar className="h-5 w-5" />}
                  label="Added On"
                  value={formatDate(department.addedOn)}
                />
                <InfoCard
                  icon={<Clock className="h-5 w-5" />}
                  label="Modified On"
                  value={formatDate(department.modifiedOn)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="group hover:border-primary/20 hover:shadow-primary/5 relative flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-colors transition-shadow transition-transform duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl dark:border-slate-800/80 dark:bg-slate-900/30 dark:hover:bg-slate-900">
      <div className="group-hover:bg-primary/10 group-hover:text-primary group-hover:ring-primary/20 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100 transition-colors dark:bg-slate-800 dark:ring-slate-700">
        <div className="group-hover:text-primary text-slate-500 transition-colors dark:text-slate-400">
          {icon}
        </div>
      </div>
      <div className="flex flex-col justify-center space-y-1">
        <span className="text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
          {label}
        </span>
        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</span>
      </div>
    </div>
  );
}
