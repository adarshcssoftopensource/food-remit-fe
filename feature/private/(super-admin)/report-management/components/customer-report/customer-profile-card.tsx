import Image from "next/image";
import { format } from "date-fns";
import {
  Building,
  Building2,
  Calendar,
  Globe,
  Hash,
  Mail,
  MapPin,
  Phone,
  UserCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import type { CustomerReportDetailData } from "../../hooks/use-get-customer-report-detail";

type ReportCustomer = CustomerReportDetailData["customer"];

function CustomerContactGrid({ customer }: { customer: ReportCustomer }) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
      <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/60 bg-white/80 p-2.5 backdrop-blur-xs dark:border-slate-800/80 dark:bg-slate-800/60">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
          <Mail className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">
            Email Address
          </p>
          <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
            {customer.email || "—"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/60 bg-white/80 p-2.5 backdrop-blur-xs dark:border-slate-800/80 dark:bg-slate-800/60">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
          <Phone className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">
            Phone Number
          </p>
          <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
            {customer.phoneNumber || "—"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/60 bg-white/80 p-2.5 backdrop-blur-xs dark:border-slate-800/80 dark:bg-slate-800/60">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <Globe className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">Country</p>
          <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
            {customer.country || "—"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/60 bg-white/80 p-2.5 backdrop-blur-xs dark:border-slate-800/80 dark:bg-slate-800/60">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
          <MapPin className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">State</p>
          <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
            {customer.state || "—"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/60 bg-white/80 p-2.5 backdrop-blur-xs dark:border-slate-800/80 dark:bg-slate-800/60">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
          <Building className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">City</p>
          <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
            {customer.city || "—"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/60 bg-white/80 p-2.5 backdrop-blur-xs dark:border-slate-800/80 dark:bg-slate-800/60">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
          <Hash className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">
            Zip Code
          </p>
          <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
            {customer.zipCode || customer.zipcode || "—"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/60 bg-white/80 p-2.5 backdrop-blur-xs sm:col-span-2 lg:col-span-3 dark:border-slate-800/80 dark:bg-slate-800/60">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
          <Building2 className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">
            Delivery / Residence Address
          </p>
          <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
            {customer.address || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

export function CustomerProfileCard({ customer }: { customer: ReportCustomer }) {
  const joinDateFormatted = customer.createdAt
    ? format(new Date(customer.createdAt), "dd MMM yyyy")
    : "—";

  const customerInitials =
    `${customer.firstName?.[0] || ""}${customer.lastName?.[0] || ""}`.toUpperCase() || "CU";

  return (
    <Card className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="relative flex shrink-0 items-center justify-center">
            {customer.profileImage ? (
              <div className="relative size-24 overflow-hidden rounded-2xl border-2 border-white shadow-md md:size-28 dark:border-slate-800">
                <Image
                  src={customer.profileImage}
                  alt={customer.fullName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 96px, 112px"
                />
              </div>
            ) : (
              <div className="flex size-24 items-center justify-center rounded-2xl border-2 border-white bg-linear-to-br from-blue-600 to-indigo-700 text-2xl font-bold tracking-wider text-white shadow-md md:size-28 dark:border-slate-800">
                {customerInitials}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-xl font-bold text-slate-900 md:text-2xl dark:text-white">
                    {customer.fullName}
                  </h2>
                  {customer.userStatus === "ACTIVE" ? (
                    <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <span className="mr-1.5 size-1.5 rounded-full bg-emerald-500" />
                      Active Account
                    </Badge>
                  ) : (
                    <Badge className="border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-50 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
                      <span className="mr-1.5 size-1.5 rounded-full bg-rose-500" />
                      {customer.userStatus || "Inactive"}
                    </Badge>
                  )}
                  {customer.emailVerifyStatus === "VERIFIED" ? (
                    <Badge
                      variant="secondary"
                      className="gap-1 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400"
                    >
                      <UserCheck className="size-3" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="gap-1 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400"
                    >
                      Unverified
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Calendar className="size-3.5 text-slate-400" />
                <span>Joined {joinDateFormatted}</span>
              </div>
            </div>

            {/* Contact and Location Grid */}
            <CustomerContactGrid customer={customer} />
          </div>
        </div>
      </div>
    </Card>
  );
}
