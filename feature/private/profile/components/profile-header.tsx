"use client";

import { useProfile } from "@/components/providers/profile-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRole } from "@/lib/formatRole";
import { Camera, Mail, ShieldCheck, Loader2 } from "lucide-react";
import { useRef } from "react";
import { useUpdateProfile } from "../hooks/use-update-profile";
import { successToast, errorToast } from "@/components/toaster";
import { useQueryClient } from "@tanstack/react-query";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";

export function ProfileHeader() {
  const { profile } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateProfileMutation = useUpdateProfile();
  const queryClient = useQueryClient();

  const displayName = profile?.name || "Admin User";
  const displayRole = formatRole(profile?.role || "");
  const displayEmail = profile?.email || "admin@foodremit.com";

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);
      await updateProfileMutation.mutateAsync(formData);
      successToast({ title: "Profile image updated successfully!" });
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.ADMIN_PROFILE });
    } catch {
      errorToast({ title: "Failed to update profile image." });
    }

    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="brand-glass-card relative mb-6 overflow-hidden rounded-3xl border border-white/60 shadow-[0_8px_30px_rgba(14,42,75,0.04)] backdrop-blur-xl dark:border-slate-800/60">
      <div className="h-32 w-full bg-linear-to-r from-emerald-600/30 via-teal-600/20 to-emerald-500/10" />

      <div className="flex flex-col items-start gap-5 px-6 pb-6 sm:flex-row sm:items-end">
        <div className="group relative -mt-12 h-24 w-24 shrink-0 overflow-hidden rounded-2xl shadow-md ring-4 ring-white dark:ring-slate-900">
          <Avatar className="h-full w-full rounded-2xl shadow-sm">
            <AvatarImage
              src={profile?.image || ""}
              alt={displayName}
              className="rounded-2xl object-cover"
            />
            <AvatarFallback className="rounded-2xl bg-linear-to-br from-emerald-600 to-teal-700 text-2xl font-black text-white">
              {initials}
            </AvatarFallback>
          </Avatar>

          <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            {updateProfileMutation.isPending ? (
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            ) : (
              <Camera className="h-6 w-6 text-white" />
            )}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleImageChange}
              disabled={updateProfileMutation.isPending}
            />
          </label>
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
