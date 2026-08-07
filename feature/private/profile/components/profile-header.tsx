"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "@/components/providers/profile-provider";
import { Mail, ShieldCheck } from "lucide-react";

export function ProfileHeader() {
  const { profile } = useProfile();

  const displayName = profile?.name || "Admin User";
  const displayRole = profile?.roleCode === "SUPER_ADMIN" ? "Super Admin" : "Sub Admin";
  const displayEmail = profile?.email || "admin@foodremit.com";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <div className="from-primary/20 via-primary/10 h-32 w-full bg-linear-to-r to-transparent" />

      <div className="flex flex-col items-start gap-5 px-6 pb-6 sm:flex-row sm:items-end">
        <div className="relative -mt-12 h-24 w-24 shrink-0 rounded-2xl ring-4 ring-white">
          <Avatar className="h-full w-full rounded-2xl shadow-sm">
            <AvatarImage src="" alt={displayName} />
            <AvatarFallback className="bg-primary/10 text-primary rounded-2xl text-2xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 space-y-1 sm:mb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-800">{displayName}</h2>
            <div className="flex items-center justify-center rounded-full bg-emerald-100 p-1 text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="text-muted-foreground text-sm font-medium">{displayRole}</p>
        </div>

        <div className="flex flex-col gap-2 sm:mb-2 sm:items-end">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 shrink-0" />
            <span>{displayEmail}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
