"use client";

import { Mail, Smartphone, Users } from "lucide-react";
import { Control, Controller } from "react-hook-form";

import { FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { SendNotificationFormValues } from "../schema/send-notification.schema";

interface TargetModeFieldProps {
  control: Control<SendNotificationFormValues>;
  roleLabel: string;
}

export function TargetModeField({ control, roleLabel }: TargetModeFieldProps) {
  return (
    <Controller
      name="targetMode"
      control={control}
      render={({ field }) => (
        <div className="space-y-3">
          <FieldLabel className="text-sm font-semibold text-gray-700">Recipients</FieldLabel>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => field.onChange("all")}
              className={cn(
                "rounded-xl border px-4 py-3 text-left transition-all",
                field.value === "all"
                  ? "border-emerald-500 bg-emerald-50/80 ring-1 ring-emerald-500/30"
                  : "border-slate-200 bg-slate-50 hover:bg-white",
              )}
            >
              <p className="text-sm font-semibold text-slate-900">Entire role</p>
              <p className="mt-1 text-xs text-slate-500">Send to every {roleLabel.toLowerCase()}</p>
            </button>
            <button
              type="button"
              onClick={() => field.onChange("selected")}
              className={cn(
                "rounded-xl border px-4 py-3 text-left transition-all",
                field.value === "selected"
                  ? "border-emerald-500 bg-emerald-50/80 ring-1 ring-emerald-500/30"
                  : "border-slate-200 bg-slate-50 hover:bg-white",
              )}
            >
              <p className="text-sm font-semibold text-slate-900">Select people</p>
              <p className="mt-1 text-xs text-slate-500">Search and pick one or many recipients</p>
            </button>
          </div>
        </div>
      )}
    />
  );
}

export function SendNotificationAside({ sendEmail }: { sendEmail: boolean }) {
  return (
    <aside className="space-y-4">
      <div className="rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50 to-teal-50 p-5">
        <p className="text-xs font-bold tracking-[0.14em] text-emerald-700 uppercase">
          Delivery channels
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex items-start gap-3">
            <span className="mt-0.5 rounded-lg bg-white p-2 text-emerald-600 shadow-xs">
              <Mail className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">Email</p>
              <p className="text-xs text-slate-600">
                {sendEmail ? "Enabled for this send" : "Disabled for this send"}
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 rounded-lg bg-white p-2 text-emerald-600 shadow-xs">
              <Users className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">Admin inbox</p>
              <p className="text-xs text-slate-600">
                Appears under the bell for admin & manager roles
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 rounded-lg bg-white p-2 text-emerald-600 shadow-xs">
              <Smartphone className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">Firebase push</p>
              <p className="text-xs text-slate-600">
                App users get FCM + mobile notification history (unchanged APIs)
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <p className="text-sm font-semibold text-slate-900">Tips</p>
        <ul className="mt-3 list-disc space-y-2 pl-4 text-xs leading-relaxed text-slate-600">
          <li>Use “Select people” for targeted announcements.</li>
          <li>App Users receive Firebase push when a device token exists.</li>
          <li>Managers and admins see unread count on the top-bar bell.</li>
        </ul>
      </div>
    </aside>
  );
}
