"use client";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Users,
  XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/common/page-header";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/config/routes";
import { getInitials } from "@/lib/get-initials";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date";

import { useGetSubAdminById } from "./hooks/use-get-sub-admin-by-id";

interface SubAdminDetailPageProps {
  id: string;
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-24 rounded-xl" />
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="rounded-3xl border p-8">
        <div className="flex items-center gap-6">
          <Skeleton className="h-24 w-24 rounded-[22px]" />
          <div className="space-y-3">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-40" />
            <div className="flex gap-2">
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-7 w-20 rounded-full" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Skeleton className="h-56 rounded-3xl" />
        <Skeleton className="h-56 rounded-3xl" />
      </div>
    </div>
  );
}

export function SubAdminDetailPage({ id }: SubAdminDetailPageProps) {
  const { data, isLoading } = useGetSubAdminById(id);
  const admin = data?.data;

  if (isLoading) return <DetailSkeleton />;
  if (!admin) return null;

  const initials = getInitials(admin.userName);
  const isActive = admin.status === "Active";

  const details = [
    {
      label: "Full Name",
      value: admin.userName,
      icon: <User className="h-4.5 w-4.5" />,
      color: "emerald",
    },
    {
      label: "Email Address",
      value: admin.email,
      icon: <Mail className="h-4.5 w-4.5" />,
      color: "primary",
    },
    {
      label: "Phone Number",
      value: admin.contactNumber || "—",
      icon: <Phone className="h-4.5 w-4.5" />,
      color: "emerald",
    },
    {
      label: "Joined On",
      value: admin.createdAt ? formatDate(admin.createdAt, { month: "long" }) : "—",
      icon: <CalendarDays className="h-4.5 w-4.5" />,
      color: "amber",
    },
  ];

  const colorMap: Record<string, string> = {
    primary: "bg-primary/10 text-primary dark:bg-primary/15 dark:text-primary/90",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  };

  return (
    <div className="space-y-6">
      {/* ── Top bar: Breadcrumbs ── */}
      <div className="flex items-center justify-between">
        <PageHeader
          breadcrumbs={[
            { label: "Sub Admin Management", href: ROUTES.ADMIN.SUB_ADMIN_MANAGEMENT.ROOT },
            { label: "Sub Admin Details" },
          ]}
        />
      </div>

      {/* ── Hero Profile Card ── */}
      <Card className="relative overflow-hidden rounded-3xl border-0 shadow-lg">
        {/* Gradient blobs */}
        <div className="bg-primary/8 pointer-events-none absolute -top-24 -right-16 h-80 w-80 rounded-full blur-3xl" />
        <div className="bg-primary/5 pointer-events-none absolute -bottom-20 left-1/3 h-64 w-64 rounded-full blur-3xl" />

        <CardContent className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Avatar + Info */}
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="from-primary/20 via-primary/10 to-primary/5 text-primary ring-primary/15 flex h-20 w-20 items-center justify-center rounded-[22px] bg-linear-to-br text-2xl font-black shadow-sm ring-1 sm:h-24 sm:w-24 sm:text-3xl">
                  {initials}
                </div>
                {/* Active/Inactive status dot */}
                <span
                  className={cn(
                    "absolute -right-1.5 -bottom-1.5 flex h-6 w-6 items-center justify-center rounded-full border-[3px] border-white shadow-sm dark:border-slate-950",
                    isActive ? "bg-emerald-500" : "bg-rose-500",
                  )}
                >
                  <span className="h-2 w-2 rounded-full bg-white" />
                </span>
              </div>

              {/* Text info */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                    {admin.userName}
                  </h1>
                </div>

                <p className="mt-1 text-sm font-medium text-slate-400 dark:text-slate-500">
                  {admin.email}
                </p>

                {/* Status + Permissions count badges */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {/* Status — read-only indicator */}
                  <div
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
                      isActive
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400",
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        isActive ? "bg-emerald-500" : "bg-rose-500",
                      )}
                    />
                    {isActive ? "Active" : "Inactive"}
                  </div>

                  <div className="border-primary/20 bg-primary/10 text-primary dark:border-primary/20 dark:bg-primary/15 flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold">
                    <ShieldCheck className="h-3 w-3" />
                    {admin.permissions?.length || 0} Permissions
                  </div>
                </div>
              </div>
            </div>

            {/* Right side — read-only status panel */}
            <div className="flex shrink-0 flex-col items-end gap-2">
              <div
                className={cn(
                  "flex items-center gap-2.5 rounded-2xl border border-emerald-200/60 bg-emerald-50/80 px-5 py-3.5 dark:border-emerald-500/20 dark:bg-emerald-500/5",
                )}
              >
                <span className={cn("relative flex h-2.5 w-2.5")}>
                  {isActive && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  )}
                  <span
                    className={cn("relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500")}
                  />
                </span>
                <span className="text-primary px-2.5 py-1 text-[12px] font-bold tracking-wider uppercase">
                  {admin.role}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Info Grid ── */}
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Personal Information */}
        <Card className="overflow-hidden rounded-3xl border border-slate-200/80 shadow-sm dark:border-slate-800">
          <CardHeader className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <Users className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Personal Information
                  </h2>
                  <p className="text-xs text-slate-400">Account and contact details</p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {details.map((item) => (
                <div
                  key={item.label}
                  className="group flex items-start gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition-colors hover:border-slate-200 hover:bg-slate-100/60 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-slate-700"
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                      colorMap[item.color],
                    )}
                  >
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      {item.label}
                    </p>
                    <p className="mt-1 truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card className="overflow-hidden rounded-3xl border border-slate-200/80 shadow-sm dark:border-slate-800">
          <CardHeader className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary dark:bg-primary/15 flex h-10 w-10 items-center justify-center rounded-xl">
                  <ShieldCheck className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Module Permissions
                  </h2>
                  <p className="text-xs text-slate-400">Assigned access rights</p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5">
            {admin.permissions?.length ? (
              <div className="grid grid-cols-1 gap-2">
                {admin.permissions.map((permission) => (
                  <div
                    key={permission.key}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition-colors hover:border-emerald-100 hover:bg-emerald-50/40 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-emerald-900/40 dark:hover:bg-emerald-500/5"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {permission.value}
                      </p>
                      <p className="mt-0.5 truncate text-[10px] font-medium tracking-wider text-slate-400 uppercase">
                        {permission.key}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold tracking-widest text-emerald-600 uppercase ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
                      Granted
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-5 text-center dark:border-slate-800 dark:bg-slate-900/40">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <XCircle className="h-6 w-6 text-slate-400" />
                </div>
                <h4 className="mt-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                  No Permissions Assigned
                </h4>
                <p className="mt-1.5 max-w-xs text-xs leading-5 text-slate-400">
                  This sub admin has no module access permissions yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
