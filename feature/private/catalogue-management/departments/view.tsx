"use client";

import { ImageLightbox } from "@/components/common/image-lightbox";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import { formatDate } from "@/lib/date";
import { ArrowLeft, Building2, Calendar, Clock, Expand, MapPin, User } from "lucide-react";
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
          <Card className="relative flex h-fit flex-col overflow-hidden rounded-3xl border-0 lg:col-span-1 dark:bg-slate-950 dark:shadow-none">
            <div className="from-primary/80 via-primary to-primary/40 absolute inset-x-0 top-0 h-40 bg-linear-to-br opacity-90" />
            <div className="bg-primary/8 pointer-events-none absolute -top-32 -right-20 h-96 w-96 rounded-full blur-3xl" />
            <div className="bg-primary/5 pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full blur-3xl" />

            <CardHeader className="relative flex flex-1 flex-col px-6 pt-4 pb-8 text-center">
              <div className="shadow-primary/20 mx-auto flex h-64 w-64 shrink-0 items-center justify-center rounded-[2.5rem] bg-white p-4 shadow-2xl ring-4 ring-white transition-transform duration-500 hover:scale-105 dark:bg-slate-900 dark:ring-slate-950">
                <div className="bg-primary/5 text-primary group relative flex h-full w-full items-center justify-center overflow-hidden rounded-[2rem]">
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
                        className="absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:opacity-100 hover:scale-110 hover:bg-black/70"
                        title="View full screen"
                      >
                        <Expand className="h-4.5 w-4.5" />
                      </Button>
                    </>
                  ) : (
                    <Building2 className="h-24 w-24" />
                  )}
                </div>
              </div>

              <div className="mt-12 w-full text-center">
                <CardTitle className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  {department.departmentName}
                </CardTitle>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <span
                    className={`inline-flex items-center gap-2.5 rounded-full px-5 py-2 text-sm font-bold shadow-sm backdrop-blur-sm transition-all ${
                      department.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 hover:bg-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/30"
                        : "bg-rose-500/10 text-rose-700 ring-1 ring-rose-500/20 hover:bg-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500/30"
                    }`}
                  >
                    <span className="relative flex h-2.5 w-2.5">
                      <span
                        className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${department.status === "ACTIVE" ? "bg-emerald-500" : "bg-rose-500"}`}
                      ></span>
                      <span
                        className={`relative inline-flex h-2.5 w-2.5 rounded-full ${department.status === "ACTIVE" ? "bg-emerald-500" : "bg-rose-500"}`}
                      ></span>
                    </span>
                    {department.status === "ACTIVE" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="rounded-3xl border border-slate-200/80 shadow-sm lg:col-span-2 dark:border-slate-800 dark:bg-slate-950">
            <CardHeader className="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
              <CardTitle className="flex items-center gap-3 text-base font-bold text-slate-900 dark:text-white">
                <div className="bg-primary flex h-11 w-11 items-center justify-center rounded-xl">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  Information Overview
                  <p className="text-xs font-normal text-slate-400">
                    Department details and metadata
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoCard
                  icon={<MapPin className="h-5 w-5" />}
                  label="Country"
                  value={department.country?.name || department.countryName || "Unknown"}
                />

                <InfoCard
                  icon={<MapPin className="h-5 w-5" />}
                  label="City"
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
    <div className="group hover:border-primary/20 hover:shadow-primary/5 relative flex items-start gap-4 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50/80 to-slate-50/40 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-md dark:border-slate-800 dark:from-slate-900/60 dark:to-slate-900/30 dark:hover:bg-slate-900">
      <div className="group-hover:bg-primary/10 group-hover:text-primary group-hover:ring-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100 transition-colors dark:bg-slate-800 dark:ring-slate-700">
        <div className="group-hover:text-primary text-slate-500 transition-colors dark:text-slate-400">
          {icon}
        </div>
      </div>
      <div className="flex flex-col justify-center space-y-1">
        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
          {label}
        </span>
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{value}</span>
      </div>
    </div>
  );
}
