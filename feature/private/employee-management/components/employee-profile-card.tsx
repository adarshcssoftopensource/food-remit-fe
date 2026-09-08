"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/get-initials";
import { CheckCircle2, Clock, Mail, MapPin, Package, Phone } from "lucide-react";
import type { Employee } from "@/feature/private/employee-management/types/employee-management";
import Image from "next/image";

interface InfoTileProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
}

function InfoTile({ icon, iconBg, label, value }: InfoTileProps) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-slate-50/80 px-3 py-2.5 dark:bg-slate-800/40">
      <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", iconBg)}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">{label}</p>
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

interface EmployeeProfileCardProps {
  employee: Employee;
  totalOrders: number;
}

export function EmployeeProfileCard({ employee, totalOrders }: EmployeeProfileCardProps) {
  const fullName = `${employee.firstName} ${employee.lastName}`.trim() || "N/A";
  const initials = getInitials(fullName);
  const isActive = employee.accountStatus === "ACTIVE";

  return (
    <Card className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/85 shadow-lg backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500" />

      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="relative shrink-0">
            {employee.image ? (
              <Image
                src={employee.image}
                alt={fullName}
                width={40}
                height={40}
                className="size-24 rounded-2xl object-cover shadow-xl ring-4 ring-emerald-500/20"
              />
            ) : (
              <div className="flex size-24 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-600 to-teal-700 text-3xl font-black text-white shadow-xl ring-4 ring-emerald-500/20">
                {initials}
              </div>
            )}
            <span
              className={cn(
                "absolute -right-1.5 -bottom-1.5 flex size-6 items-center justify-center rounded-full border-2 border-white shadow-sm dark:border-slate-900",
                isActive ? "bg-emerald-500" : "bg-slate-400",
              )}
            >
              <span className="size-2 rounded-full bg-white" />
            </span>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {fullName}
              </h2>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold",
                  isActive
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-400"
                    : "border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400",
                )}
              >
                {isActive ? <CheckCircle2 className="size-3" /> : <Clock className="size-3" />}
                {employee.accountStatus || "ACTIVE"}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <InfoTile
                icon={<Mail className="size-4" />}
                iconBg="bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
                label="Email"
                value={employee.email}
              />
              <InfoTile
                icon={<Phone className="size-4" />}
                iconBg="bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400"
                label="Phone"
                value={`${employee.countryCode ? `${employee.countryCode} ` : ""}${employee.phoneNumber || "N/A"}`}
              />
              {employee.city && (
                <InfoTile
                  icon={<MapPin className="size-4" />}
                  iconBg="bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
                  label="Location"
                  value={[employee.city, employee.state].filter(Boolean).join(", ")}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:w-40 sm:grid-cols-1">
            <div className="rounded-2xl bg-linear-to-br from-emerald-50 to-teal-50 p-3 text-center dark:from-emerald-950/30 dark:to-teal-950/30">
              <Package className="mx-auto mb-1 size-5 text-emerald-600 dark:text-emerald-400" />
              <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
                {totalOrders}
              </p>
              <p className="text-[10px] font-bold tracking-wide text-emerald-600/70 uppercase dark:text-emerald-500">
                Assigned
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
