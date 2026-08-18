"use client";

import { CalendarDays, CheckCircle2, Mail, Phone, ShieldCheck, User, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import { getInitials } from "@/lib/get-initials";
import { formatDate } from "@/lib/date";
import { SubAdminData } from "../types/sub-admin.types";
import { InfoCard } from "./info-card";

interface SubAdminDetailDialogProps {
  admin: SubAdminData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubAdminDetailDialog({ admin, open, onOpenChange }: SubAdminDetailDialogProps) {
  const details = [
    {
      label: "Full Name",
      value: admin?.userName,
      icon: <User className="h-5 w-5" />,
    },
    {
      label: "Email Address",
      value: admin?.email,
      icon: <Mail className="h-5 w-5" />,
    },
    {
      label: "Phone Number",
      value: admin?.contactNumber,
      icon: <Phone className="h-5 w-5" />,
    },
    {
      label: "Joined On",
      value: admin?.createdAt ? formatDate(admin.createdAt, { month: "short" }) : "-",
      icon: <CalendarDays className="h-5 w-5" />,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92vh] w-[calc(100%-1rem)] max-w-6xl flex-col overflow-hidden rounded-[30px] border border-slate-200/80 bg-slate-50 p-0 shadow-[0_30px_100px_-30px_rgba(15,23,42,0.35)] sm:w-full dark:border-slate-800 dark:bg-slate-950">
        <div className="relative overflow-hidden border-b border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-950">
          <div className="bg-primary/6 pointer-events-none absolute -top-32 -right-20 h-72 w-72 rounded-full blur-3xl" />
          <div className="bg-primary/100/5 pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full blur-3xl" />

          <DialogHeader className="relative px-5 py-7 sm:px-8 sm:py-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="relative">
                  <div className="from-primary/15 via-primary/10 text-primary ring-primary/10 to-primary/10 flex h-18 w-18 items-center justify-center rounded-[22px] bg-linear-to-br text-xl font-black ring-1 sm:h-20 sm:w-20 sm:text-2xl">
                    {getInitials(admin?.userName)}
                  </div>

                  <span
                    className={`absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full border-[3px] border-white dark:border-slate-950 ${
                      admin?.status === "Active" ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-white" />
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <DialogTitle className="truncate text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                      {admin?.userName}
                    </DialogTitle>

                    <span className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase">
                      Sub Admin
                    </span>
                  </div>

                  <DialogDescription className="mt-1.5 text-sm font-medium text-slate-400 dark:text-slate-500">
                    Sub Administrator Account
                  </DialogDescription>
                </div>
              </div>

              <Badge
                className={`w-fit rounded-full border px-4 py-2 text-xs font-bold shadow-none ${
                  admin?.status === "Active"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
                }`}
              >
                <span
                  className={`mr-2 h-1.5 w-1.5 rounded-full ${
                    admin?.status === "Active" ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
                {admin?.status === "Active" ? "Active Account" : "Inactive Account"}
              </Badge>
            </div>
          </DialogHeader>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <div className="p-4 sm:p-6 lg:p-7">
            <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
              <Card className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                        <Users className="h-4.5 w-4.5" />
                      </div>

                      <div>
                        <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                          Personal Information
                        </h3>

                        <p className="mt-0.5 text-xs text-slate-400">Account and contact details</p>
                      </div>
                    </div>

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:bg-slate-900">
                      Profile
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {details.map((item) => (
                      <InfoCard
                        key={item.label}
                        icon={item.icon}
                        label={item.label}
                        value={item.value || "-"}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary dark:bg-primary/100/10 dark:text-primary/80 flex h-10 w-10 items-center justify-center rounded-xl">
                        <ShieldCheck className="h-4.5 w-4.5" />
                      </div>

                      <div>
                        <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                          Permissions
                        </h3>

                        <p className="mt-0.5 text-xs text-slate-400">Assigned module access</p>
                      </div>
                    </div>

                    <Badge className="border-primary/20 bg-primary/10 text-primary dark:border-primary/20 dark:bg-primary/100/10 dark:text-primary/80 rounded-lg border px-2.5 py-1 text-xs font-bold shadow-none">
                      {admin?.permissions?.length || 0}{" "}
                      {admin?.permissions?.length === 1 ? "Access" : "Accesses"}
                    </Badge>
                  </div>

                  <div className="mt-6">
                    {admin?.permissions?.length ? (
                      <div className="grid grid-cols-1 gap-2.5">
                        {admin.permissions.map((permission) => (
                          <div
                            key={permission?.key}
                            className="group flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/50"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                              <CheckCircle2 className="h-4.25 w-4.25" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                                {permission?.value}
                              </p>

                              <p className="mt-0.5 truncate text-[10px] font-medium tracking-wider text-slate-400 uppercase">
                                {permission?.key}
                              </p>
                            </div>

                            <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold tracking-wider text-emerald-600 uppercase dark:bg-emerald-500/10 dark:text-emerald-400">
                              Granted
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex min-h-70 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-5 text-center dark:border-slate-800 dark:bg-slate-900/40">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                          <ShieldCheck className="h-6 w-6 text-slate-400" />
                        </div>

                        <h4 className="mt-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                          No Permissions Assigned
                        </h4>

                        <p className="mt-1.5 max-w-xs text-xs leading-5 text-slate-400">
                          This sub admin currently has no module access permissions assigned.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
