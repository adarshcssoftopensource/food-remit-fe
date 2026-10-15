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
    <div className="relative mb-6 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8 xl:gap-10">
        {/* Left: User Avatar & Details */}
        <div className="flex min-w-0 flex-1 flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-5">
          {/* Avatar with Camera Icon and Change Photo Button */}
          <div className="flex shrink-0 flex-col items-center gap-2">
            <div className="relative">
              <Avatar className="size-20 rounded-full object-cover ring-4 ring-emerald-50 sm:size-24 dark:ring-slate-800">
                <AvatarImage
                  src={profile?.image || ""}
                  alt={displayName}
                  className="rounded-full object-cover"
                />
                <AvatarFallback className="rounded-full bg-linear-to-br from-emerald-600 to-teal-700 text-xl font-bold text-white sm:text-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {canEditImages && (
                <label
                  className="absolute right-0 bottom-0 flex size-7 cursor-pointer items-center justify-center rounded-full bg-emerald-600 text-white shadow-md transition-transform hover:scale-105 hover:bg-emerald-700"
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

            {canEditImages && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={updateProfileMutation.isPending}
                className="h-7 rounded-lg border-slate-200 px-3 text-[11px] font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
              >
                Change Photo
              </Button>
            )}
          </div>

          {/* User Name, Roles, Subtitle, and Badges */}
          <div className="min-w-0 flex-1 space-y-1.5 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                {displayName}
              </h2>
              <span
                className="inline-flex size-5 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs"
                title="Verified Account"
              >
                <Check className="size-3 stroke-3" />
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

            {/* Badges Row */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1.5 sm:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-1 text-xs font-semibold text-white shadow-xs">
                <ShoppingBag className="size-3.5" />
                Active Account
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                <Mail className="size-3.5" />
                Email Verified
              </span>

              {isKycVerified && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <ShieldCheck className="size-3.5" />
                  Identity Verified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Divider between Profile and Store */}
        {hasAssignedStore && (
          <>
            <div className="hidden h-28 w-px shrink-0 bg-slate-200/80 lg:block dark:bg-slate-800" />
            <div className="block h-px w-full bg-slate-100 lg:hidden dark:bg-slate-800" />
          </>
        )}

        {/* Right: Assigned Store Section */}
        {hasAssignedStore && (
          <div className="flex w-full min-w-0 flex-col items-center gap-4 sm:flex-row sm:items-start lg:w-auto">
            {/* Store Thumbnail */}
            <div className="group/storeimg relative h-24 w-36 shrink-0 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100 shadow-2xs sm:h-26 sm:w-40 dark:border-slate-700 dark:bg-slate-800">
              {currentStoreImage ? (
                <>
                  <Image
                    src={currentStoreImage}
                    alt={currentStoreName}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover/storeimg:opacity-100">
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

            {/* Store Text Info & Action */}
            <div className="min-w-0 flex-1 space-y-1 text-center sm:text-left">
              <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Assigned Store
              </p>
              <h4 className="truncate text-base font-bold text-slate-900 dark:text-white">
                {currentStoreName}
              </h4>
              {storeCode && (
                <p className="font-mono text-xs text-slate-500 dark:text-slate-400">{storeCode}</p>
              )}
              {storeLocation && (
                <p className="flex items-center justify-center text-xs text-slate-500 sm:justify-start dark:text-slate-400">
                  <MapPin className="mr-1 size-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{storeLocation}</span>
                </p>
              )}

              {onViewStoreDetails && (
                <div className="pt-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onViewStoreDetails}
                    className="h-8 gap-1.5 rounded-xl border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    View Store Details
                    <ArrowRight className="size-3.5" />
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
