"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Mail, Phone, ShieldCheck } from "lucide-react";

export function ProfileHeader() {
  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <div className="from-primary/20 via-primary/10 h-32 w-full bg-linear-to-r to-transparent" />

      <div className="flex flex-col items-start gap-5 px-6 pb-6 sm:flex-row sm:items-end">
        <div className="relative -mt-12 h-24 w-24 shrink-0 rounded-2xl ring-4 ring-white">
          <Avatar className="h-full w-full rounded-2xl shadow-sm">
            <AvatarImage src="" alt="Admin User" />
            <AvatarFallback className="bg-primary/10 text-primary rounded-2xl text-2xl font-bold">
              AU
            </AvatarFallback>
          </Avatar>

          <Button
            size="icon"
            className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full shadow-md transition-transform hover:scale-105"
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 space-y-1 sm:mb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-800">Admin User</h2>
            <div className="flex items-center justify-center rounded-full bg-emerald-100 p-1 text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="text-muted-foreground font-medium">Super Admin</p>
        </div>

        <div className="flex flex-col gap-2 sm:mb-2 sm:items-end">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 shrink-0" />
            <span>admin@foodremit.com</span>
          </div>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 shrink-0" />
            <span>+1 (555) 123-4567</span>
          </div>
        </div>
      </div>
    </div>
  );
}
