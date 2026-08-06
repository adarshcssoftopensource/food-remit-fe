"use client";

import { CalendarDays, Mail, Phone, ShieldCheck, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SubAdminData } from "../types/sub-admin-permission.types";
import { InfoCard } from "./info-card";

interface SubAdminDetailDialogProps {
  admin: SubAdminData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubAdminDetailDialog({ admin, open, onOpenChange }: SubAdminDetailDialogProps) {
  if (!admin) return null;

  const initials = admin.userName
    .split(/[\s-_]/)
    .map((x) => x[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const details = [
    {
      label: "Full Name",
      value: admin.userName,
      icon: <User className="h-4 w-4" />,
    },
    {
      label: "Email Address",
      value: admin.email,
      icon: <Mail className="h-4 w-4" />,
    },
    {
      label: "Phone Number",
      value: admin.contactNumber,
      icon: <Phone className="h-4 w-4" />,
    },
    {
      label: "Joined On",
      value: admin.createdAt.split(" ")[0],
      icon: <CalendarDays className="h-4 w-4" />,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] w-[95vw] max-w-5xl overflow-hidden rounded-3xl border-0 p-0">
        <div className="overflow-y-auto">
          <div className="relative overflow-hidden bg-gray-200 px-8 py-10">
            <div className="bg-primary/20 absolute -bottom-20 -left-20 h-60 w-60 rounded-full" />

            <DialogHeader className="relative p-0">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-5">
                  <div className="bg-primary flex h-24 w-24 items-center justify-center rounded-3xl text-3xl font-bold text-white shadow-lg backdrop-blur">
                    {initials}
                  </div>

                  <div>
                    <DialogTitle className="text-3xl font-bold text-gray-700">
                      {admin.userName}
                    </DialogTitle>

                    <DialogDescription className="mt-2 text-base text-gray-700">
                      Sub Admin • ID #{admin.userId}
                    </DialogDescription>
                  </div>
                </div>

                <Badge
                  className={`rounded-full px-5 py-2 text-sm ${
                    admin.status === "Active"
                      ? "bg-emerald-600 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {admin.status}
                </Badge>
              </div>
            </DialogHeader>
          </div>

          <div className="grid gap-6 bg-slate-50 p-8 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Personal Information</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                {details.map((item) => (
                  <InfoCard
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </div>
            </div>

            <div className="mt-14 space-y-6">
              <Card className="rounded-2xl border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                      <ShieldCheck className="text-primary h-5 w-5" />
                      Permissions
                    </h3>

                    <Badge variant="secondary">{admin.permissions.length} Modules</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {admin.permissions.map((permission) => (
                      <Badge
                        key={permission}
                        variant="outline"
                        className="justify-center rounded-lg py-2 text-sm"
                      >
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
