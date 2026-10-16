"use client";

import { ImageLightbox } from "@/components/common/image-lightbox";
import { useProfile } from "@/providers/profile-provider";
import { errorToast, successToast } from "@/components/toaster";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { formatRole } from "@/lib/format-role";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  Camera,
  Check,
  Loader2,
  Mail,
  MapPin,
  Maximize2,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Store,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { getDefaultStoreImageForBusinessType } from "@/constants/default-store-images";
import { fetcher } from "@/hooks/useApi";
import { useUpdateStore } from "@/feature/private/(super-admin)/store-management/hooks/use-update-store";
import { useUpdateProfile } from "../hooks/use-update-profile";

interface ProfileHeaderProps {
  onViewStoreDetails?: () => void;
}

export function ProfileHeader({ onViewStoreDetails }: ProfileHeaderProps) {
  const { profile, needsBankVerification, refetchProfile } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const storeFileInputRef = useRef<HTMLInputElement>(null);
  const updateProfileMutation = useUpdateProfile();
  const queryClient = useQueryClient();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const isEmployee = profile?.roleCode === "EMPLOYEE" || profile?.role === "employee";
  const isStoreManager = profile?.roleCode === "STORE_MANAGER" || profile?.role === "store_manager";
  const canEditImages = !needsBankVerification;
  const canEditStoreImage = !needsBankVerification && !isEmployee;

  const storeId = profile?.stores?.[0]?.id || "";
  const updateStoreMutation = useUpdateStore(storeId);

  const { data: storeData } = useQuery({
    queryKey: ["store", storeId],
    queryFn: async () => {
      if (!storeId) return null;
      const res = await fetcher<any>({
        url: `/admin/stores/${storeId}`,
        method: "get",
      });
      return res.data;
    },
    enabled: !!storeId,
  });

  const businessType =
    storeData?.partnerLead?.businessType ||
    profile?.partnerLead?.businessType ||
    storeData?.businessType ||
    "";
  const defaultImage =
    getDefaultStoreImageForBusinessType(businessType)?.imageUrl ||
    "/images/default-stores/convenience-store.jpg";

  const currentStore = storeData || profile?.stores?.[0];
  const currentStoreImage =
    storeData?.storeImage !== undefined &&
    storeData?.storeImage !== null &&
    storeData?.storeImage !== ""
      ? storeData.storeImage
      : profile?.stores?.[0]?.storeImage || defaultImage;

  const currentStoreName =
    currentStore?.storeName || profile?.stores?.[0]?.storeName || "Assigned Store";
  const storeCode =
    currentStore?.storeId ||
    storeData?.storeId ||
    currentStore?.code ||
    (currentStore?.id ? `STR-${currentStore.id.slice(0, 6).toUpperCase()}` : "");

  const storeCity =
    currentStore?.storeCity ||
    currentStore?.cityName ||
    currentStore?.city ||
    storeData?.storeCity ||
    storeData?.cityName ||
    storeData?.city ||
    "";
  const storeCountry =
    currentStore?.storeCountry ||
    currentStore?.countryName ||
    currentStore?.country ||
    storeData?.storeCountry ||
    storeData?.countryName ||
    storeData?.country ||
    "";
  const storeLocation =
    [storeCity, storeCountry].filter(Boolean).join(", ") ||
    currentStore?.storeAddress ||
    storeData?.storeAddress ||
    "Burgess Hill, England";

  const hasAssignedStore = Boolean(profile?.stores?.[0] || storeData || isStoreManager);

  const partnerLead = profile?.partnerLead || storeData?.partnerLead;
  const kycRecord = partnerLead?.kycVerifications?.[0] || partnerLead?.kycData;
  const kycStatus = (
    partnerLead?.kycStatus ||
    kycRecord?.status ||
    (profile as any)?.kycStatus ||
    (storeData as any)?.kycStatus ||
    ""
  ).toUpperCase();

  const isKycVerified =
    kycStatus === "APPROVED" ||
    Boolean(partnerLead?.kycVerifiedAt) ||
    Boolean((profile as any)?.kycVerifiedAt) ||
    (profile as any)?.isKycVerified === true ||
    (profile as any)?.kycVerified === true;

  const displayName = profile?.name || "Admin User";
  const displayRole = formatRole(profile?.role || "Store Manager");

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !canEditImages) return;

    try {
      const formData = new FormData();
      formData.append("image", file);
      await updateProfileMutation.mutateAsync(formData);
      successToast({ title: "Profile image updated successfully!" });
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.ADMIN_PROFILE });
      refetchProfile();
    } catch {}

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleStoreImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !storeId || !canEditStoreImage) return;

    try {
      const formData = new FormData();
      formData.append("storeImage", file);
      await updateStoreMutation.mutateAsync(formData as any);
      successToast({ title: "Store image updated successfully!" });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.ADMIN_PROFILE }),
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.STORES }),
        queryClient.invalidateQueries({ queryKey: ["store", storeId] }),
      ]);
      refetchProfile();
    } catch {
      errorToast({ title: "Failed to update store image." });
    }

    if (storeFileInputRef.current) {
      storeFileInputRef.current.value = "";
    }
  };

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative mb-6 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-7 dark:border-slate-800 dark:bg-slate-900/90">
      <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-emerald-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-teal-500/5 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div className="flex shrink-0 flex-col items-center gap-2.5">
            <div className="relative">
              <Avatar className="size-22 rounded-full object-cover shadow-sm ring-4 ring-emerald-500/10 sm:size-26 dark:ring-emerald-500/20">
                <AvatarImage
                  src={profile?.image || ""}
                  alt={displayName}
                  className="rounded-full object-cover"
                />
                <AvatarFallback className="rounded-full bg-linear-to-br from-emerald-600 via-teal-600 to-emerald-700 text-2xl font-extrabold text-white sm:text-3xl">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {canEditImages && (
                <label
                  className="absolute right-0.5 bottom-0.5 flex size-7.5 cursor-pointer items-center justify-center rounded-full bg-emerald-600 text-white shadow-md ring-2 ring-white transition-transform hover:scale-110 hover:bg-emerald-700 dark:ring-slate-900"
                  title="Change profile photo"
                >
                  {updateProfileMutation.isPending ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Camera className="size-3.5" />
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

            {/* {canEditImages && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={updateProfileMutation.isPending}
                className="h-7.5 rounded-xl border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Change Photo
              </Button>
            )} */}
          </div>

          <div className="min-w-0 flex-1 space-y-2 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                {displayName}
              </h2>
              <span
                className="inline-flex size-5.5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs"
                title="Verified Account"
              >
                <Check className="size-3.5 stroke-3" />
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-500 sm:text-sm dark:text-slate-400">
              {displayRole}
            </p>

            {currentStoreName && (
              <p className="text-xs font-medium text-slate-600 sm:text-sm dark:text-slate-300">
                {currentStoreName} {storeCode ? `• ${storeCode}` : ""}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 sm:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs shadow-emerald-600/25">
                <ShoppingBag className="size-3.5" />
                Active Account
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/90 bg-emerald-50 px-3.5 py-1.5 text-xs font-medium text-emerald-700 dark:border-emerald-800/80 dark:bg-emerald-950/40 dark:text-emerald-300">
                <Mail className="size-3.5" />
                Email Verified
              </span>

              {isKycVerified && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/90 bg-emerald-50 px-3.5 py-1.5 text-xs font-medium text-emerald-700 dark:border-emerald-800/80 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <ShieldCheck className="size-3.5" />
                  Identity Verified
                </span>
              )}
            </div>
          </div>
        </div>

        {hasAssignedStore && (
          <div className="flex w-full min-w-0 flex-col items-center gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 shadow-2xs sm:flex-row sm:items-start lg:w-auto lg:min-w-90 xl:min-w-100 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="group/storeimg relative h-24 w-36 shrink-0 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs sm:h-28 sm:w-44 dark:border-slate-700 dark:bg-slate-800">
              {currentStoreImage ? (
                <>
                  <Image
                    src={currentStoreImage}
                    alt={currentStoreName}
                    fill
                    className="object-cover transition-transform duration-300 group-hover/storeimg:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity duration-200 group-hover/storeimg:opacity-100">
                    <button
                      type="button"
                      onClick={() => setLightboxOpen(true)}
                      className="flex size-7 items-center justify-center rounded-full bg-white/30 text-white backdrop-blur-xs transition hover:scale-110 hover:bg-white/50"
                      title="View store image"
                    >
                      <Maximize2 className="size-3.5" />
                    </button>
                    {canEditStoreImage && (
                      <label
                        className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-white/30 text-white backdrop-blur-xs transition hover:scale-110 hover:bg-white/50"
                        title="Change store image"
                      >
                        {updateStoreMutation.isPending ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Camera className="size-3.5" />
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
                </>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <Store className="size-8" />
                  {canEditStoreImage && (
                    <label
                      className="mt-1 flex cursor-pointer items-center gap-1 text-[10px] font-semibold text-emerald-700 hover:underline dark:text-emerald-300"
                      title="Upload store image"
                    >
                      <Camera className="size-3" /> Upload
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
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-1 text-center sm:text-left">
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                Assigned Store
              </p>
              <h4 className="truncate text-base font-bold tracking-tight text-slate-900 dark:text-white">
                {currentStoreName}
              </h4>
              {storeCode && (
                <p className="font-mono text-xs font-medium text-slate-500 dark:text-slate-400">
                  {storeCode}
                </p>
              )}
              {storeLocation && (
                <p className="flex items-center justify-center text-xs font-medium text-slate-500 sm:justify-start dark:text-slate-400">
                  <MapPin className="mr-1 size-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{storeLocation}</span>
                </p>
              )}

              {onViewStoreDetails && (
                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onViewStoreDetails}
                    className="group h-8.5 gap-2 rounded-xl border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    View Store Details
                    <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {lightboxOpen && currentStoreImage && (
        <ImageLightbox
          src={currentStoreImage}
          onClose={() => setLightboxOpen(false)}
          alt={currentStoreName}
        />
      )}
    </div>
  );
}
