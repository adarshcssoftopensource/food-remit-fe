"use client";

import { Card, CardContent } from "@/components/ui/card";
import { PhoneDisplay } from "@/components/ui/phone-display";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/get-initials";
import {
  Building2,
  CheckCircle2,
  Clock,
  Hash,
  Home,
  Mail,
  MapPin,
  Package,
  Phone,
} from "lucide-react";
import type { Employee } from "@/feature/private/employee-management/types/employee-management";
import Image from "next/image";
import type { ReactNode } from "react";

interface InfoTileProps {
  icon: ReactNode;
  iconBg: string;
  label: string;
  value: ReactNode;
  className?: string;
}

function InfoTile({ icon, iconBg, label, value, className }: InfoTileProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-xl bg-slate-50/80 px-3 py-2.5 dark:bg-slate-800/40",
        className,
      )}
    >
      <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", iconBg)}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">{label}</p>
        <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">{value}</div>
      </div>
    </div>
  );
}

function LocationField({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | null;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/40">
      <div className="mb-1.5 flex items-center gap-1.5 text-slate-400">
        {icon}
        <p className="text-[10px] font-bold tracking-wider uppercase">{label}</p>
      </div>
      <p className="text-sm font-semibold wrap-break-word text-slate-900 dark:text-white">
        {value?.trim() || "—"}
      </p>
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

      <CardContent className="space-y-6 p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="relative shrink-0">
            {employee.image ? (
              <Image
                src={employee.image}
                alt={fullName}
                width={96}
                height={96}
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

          <div className="min-w-0 flex-1 space-y-4">
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

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                value={
                  <PhoneDisplay
                    countryCode={employee.countryCode}
                    phoneNumber={employee.phoneNumber}
                    className="font-semibold"
                    emptyLabel="N/A"
                  />
                }
              />
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

        {/* Location — mirrors Add Employee form section */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex items-center gap-3 border-b border-slate-100 bg-linear-to-r from-violet-50/80 to-transparent px-5 py-4 dark:border-slate-800 dark:from-violet-950/30">
            <div className="flex size-9 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/50">
              <MapPin className="size-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Location</h3>
              <p className="text-xs text-slate-500">Employee residential address</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
            <LocationField
              label="Address"
              value={employee.address}
              icon={<Home className="size-3.5" />}
            />
            <LocationField
              label="City"
              value={employee.city}
              icon={<Building2 className="size-3.5" />}
            />
            <LocationField
              label="State"
              value={employee.state}
              icon={<MapPin className="size-3.5" />}
            />
            <LocationField
              label="Zip Code"
              value={employee.zipCode}
              icon={<Hash className="size-3.5" />}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
