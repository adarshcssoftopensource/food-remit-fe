"use client";

import { CalendarDays, CheckCircle2, Mail, Phone, ShieldCheck, User } from "lucide-react";

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
      value: admin?.createdAt
        ? new Date(admin.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "-",
      icon: <CalendarDays className="h-5 w-5" />,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-6xl flex-col overflow-hidden rounded-3xl border-0 p-0 shadow-2xl">
        <div className="relative bg-slate-100 px-5 py-8 sm:px-8 sm:py-10">
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <DialogHeader className="relative p-0">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border text-2xl font-bold sm:h-24 sm:w-24 sm:text-3xl">
                  {getInitials(admin?.userName)}
                </div>

                <div>
                  <DialogTitle className="text-2xl font-bold sm:text-3xl">
                    {admin?.userName}
                  </DialogTitle>

                  <DialogDescription className="mt-2 text-sm sm:text-base">
                    Sub Administrator
                  </DialogDescription>
                </div>
              </div>

              <Badge
                className={`w-fit rounded-full border-0 px-5 py-2 text-sm font-semibold ${
                  admin?.status === "Active" ||
                  (admin?.status as any) === 1 ||
                  (admin?.status as any) === "1"
                    ? "bg-emerald-500 text-white hover:bg-emerald-500"
                    : "bg-red-500 text-white hover:bg-red-500"
                }`}
              >
                {admin?.status === "Active" ||
                (admin?.status as any) === 1 ||
                (admin?.status as any) === "1"
                  ? "Active"
                  : "Inactive"}
              </Badge>
            </div>
          </DialogHeader>
        </div>
        <ScrollArea className="max-h-[70vh] overflow-auto">
          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.4fr_0.8fr] lg:p-8">
            <Card className="rounded-3xl border-0">
              <CardContent className="space-y-6 p-5 sm:p-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">Personal Information</h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Basic details of this sub admin account
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

            <Card className="rounded-3xl border-0">
              <CardContent className="p-5 sm:p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                    <ShieldCheck className="text-primary h-5 w-5" />
                    Permissions
                  </h3>

                  <Badge className="rounded-full px-4">{admin?.permissions?.length || 0}</Badge>
                </div>

                {admin?.permissions?.length ? (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {admin?.permissions?.map((permission) => (
                      <div
                        key={permission?.key}
                        className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-linear-to-r from-indigo-50 to-violet-50 p-4 transition-all"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-800">{permission?.value}</p>

                          <p className="truncate text-xs text-slate-500">{permission?.key}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-60 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 text-center">
                    <ShieldCheck className="mb-3 h-10 w-10 text-slate-400" />

                    <h4 className="font-semibold text-slate-700">No Permissions Assigned</h4>

                    <p className="mt-2 text-sm text-slate-500">
                      This sub admin currently has no
                      <br />
                      module access permissions.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
