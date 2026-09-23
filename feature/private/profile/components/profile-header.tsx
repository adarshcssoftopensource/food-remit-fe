"use client";

import { ImageLightbox } from "@/components/common/image-lightbox";
import { useProfile } from "@/components/providers/profile-provider";
import { errorToast, successToast } from "@/components/toaster";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { formatRole } from "@/lib/formatRole";
import { useQueryClient } from "@tanstack/react-query";
import { Camera, Loader2, Mail, Maximize2, ShieldCheck, Store } from "lucide-react";
import { useRef, useState } from "react";
import { useUpdateStore } from "../../store-management/hooks/use-update-store";
import { useUpdateProfile } from "../hooks/use-update-profile";

export function ProfileHeader() {
  const { profile, needsBankVerification } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateProfileMutation = useUpdateProfile();
  const queryClient = useQueryClient();

  const storeFileInputRef = useRef<HTMLInputElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const canEditImages = !needsBankVerification;

  const storeId = profile?.stores?.[0]?.id || "";
  const updateStoreMutation = useUpdateStore(storeId);

  const handleStoreImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !storeId || !canEditImages) return;

    try {
      const formData = new FormData();
      formData.append("storeImage", file);
      await updateStoreMutation.mutateAsync(formData as any);
      successToast({ title: "Store image updated successfully!" });
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.ADMIN_PROFILE });
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.STORES });
    } catch {
      errorToast({ title: "Failed to update store image." });
    }

    if (storeFileInputRef.current) {
      storeFileInputRef.current.value = "";
    }
  };

  const displayName = profile?.name || "Admin User";
  const displayRole = formatRole(profile?.role || "");
  const displayEmail = profile?.email || "admin@foodremit.com";
  const displayStores = profile?.stores ? profile.stores.map((s) => s.storeName).join(", ") : null;

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !canEditImages) return;

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
      {(profile?.roleCode === "STORE_MANAGER" ||
        profile?.roleCode === "EMPLOYEE" ||
        profile?.role === "employee" ||
        profile?.role === "store_manager") &&
      profile?.stores?.[0] ? (
        <div
          className="group/banner relative flex h-24 w-full items-center justify-center bg-cover bg-center bg-no-repeat transition-all sm:h-32"
          style={{
            backgroundImage: profile.stores[0].storeImage
              ? `url(${profile.stores[0].storeImage})`
              : undefined,
          }}
        >
          <div
            className={`absolute inset-0 transition-all ${profile.stores[0].storeImage ? "bg-emerald-950/40 backdrop-blur-[1px] group-hover/banner:bg-emerald-950/60 group-hover/banner:backdrop-blur-sm" : "bg-linear-to-r from-emerald-600/30 via-teal-600/20 to-emerald-500/10 group-hover/banner:bg-emerald-600/40"}`}
          />

          <div className="absolute z-10 flex items-center gap-4 opacity-0 transition-opacity group-hover/banner:opacity-100">
            {profile.stores[0].storeImage && (
              <button
                onClick={() => setLightboxOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-transform hover:scale-110 hover:bg-white/30"
              >
                <Maximize2 className="h-5 w-5" />
              </button>
            )}
            {canEditImages && (
              <label className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-transform hover:scale-110 hover:bg-white/30">
                {updateStoreMutation.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Camera className="h-5 w-5" />
                )}
                <input
                  type="file"
                  ref={storeFileInputRef}
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleStoreImageChange}
                  disabled={updateStoreMutation.isPending}
                />
              </label>
            )}
          </div>
        </div>
      ) : (
        <div className="h-24 w-full bg-linear-to-r from-emerald-600/30 via-teal-600/20 to-emerald-500/10 sm:h-32" />
      )}

      <div className="flex flex-col items-start gap-4 px-4 pb-4 sm:flex-row sm:items-end sm:gap-5 sm:px-6 sm:pb-6">
        <div className="group relative -mt-10 h-20 w-20 shrink-0 overflow-hidden rounded-2xl shadow-md ring-4 ring-white sm:-mt-12 sm:h-24 sm:w-24 dark:ring-slate-900">
          <Avatar className="h-full w-full rounded-2xl shadow-sm">
            <AvatarImage
              src={profile?.image || ""}
              alt={displayName}
              className="rounded-2xl object-cover"
            />
            <AvatarFallback className="rounded-2xl bg-linear-to-br from-emerald-600 to-teal-700 text-xl font-black text-white sm:text-2xl">
              {initials}
            </AvatarFallback>
          </Avatar>

          {canEditImages && (
            <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              {updateProfileMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin text-white sm:h-6 sm:w-6" />
              ) : (
                <Camera className="h-5 w-5 text-white sm:h-6 sm:w-6" />
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
          )}
        </div>

        <div className="flex-1 space-y-1 sm:mb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">{displayName}</h2>
            <div className="flex items-center justify-center rounded-full bg-emerald-100 p-1 text-emerald-600">
              <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-xs font-medium sm:text-sm">{displayRole}</p>
            {displayStores && (
              <div className="flex w-fit items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 sm:px-2.5 sm:text-sm">
                <Store className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span className="truncate">{displayStores}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:mb-2 sm:items-end">
          <div className="text-muted-foreground flex items-center gap-2 text-xs sm:text-sm">
            <Mail className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            <span className="truncate">{displayEmail}</span>
          </div>
        </div>
      </div>

      {lightboxOpen && profile?.stores?.[0]?.storeImage && (
        <ImageLightbox
          src={profile.stores[0].storeImage}
          onClose={() => setLightboxOpen(false)}
          alt={profile.stores[0].storeName}
        />
      )}
    </div>
  );
}
