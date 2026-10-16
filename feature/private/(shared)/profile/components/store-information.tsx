"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Check,
  CheckCircle2,
  Lock,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { findPhoneCountry, resolveFromValue } from "@/components/ui/phone-input-utils";
import { useSidebar } from "@/components/ui/sidebar";
import { BUSINESS_TYPES } from "@/constants/become-a-partner";

import { AdditionalDocumentsCard } from "@/feature/private/(store-admin)/partner-leads/components/cards/additional-documents-card";
import { KycVerificationCard } from "@/feature/private/(store-admin)/partner-leads/components/cards/kyc-verification-card";
import { LocationDetailsCard } from "@/feature/private/(store-admin)/partner-leads/components/cards/location-details-card";
import { OperationalPreferencesCard } from "@/feature/private/(store-admin)/partner-leads/components/cards/operational-preferences-card";
import { ProfileBankVerification } from "@/feature/private/(shared)/profile/components/profile-bank-verification";

import { successToast } from "@/components/toaster";
import { getDefaultStoreImageForBusinessType } from "@/constants/default-store-images";
import { useUpdateStore } from "@/feature/private/(super-admin)/store-management/hooks/use-update-store";
import { fetcher } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { cn } from "@/lib/utils";
import { useProfile } from "@/providers/profile-provider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { storeInfoSchema, type StoreInfoValues } from "../schema/store-info.schema";
import {
  StoreImageField,
  StoreLocationFields,
  StorePhoneField,
  StoreProductScreeningFields,
  StoreSameDayDeliveryFields,
} from "./store-information-fields";

export function StoreInformation() {
  const { profile, needsBankVerification, refetchProfile } = useProfile();
  const queryClient = useQueryClient();
  const { state: sidebarState, isMobile } = useSidebar();
  const sidebarOffset = isMobile ? 0 : sidebarState === "collapsed" ? 48 : 256;
  const storeId = profile?.stores?.[0]?.id;
  const [phoneIso, setPhoneIso] = useState<string | undefined>(undefined);
  const isEmployee = profile?.roleCode === "EMPLOYEE" || profile?.role === "employee";

  const { data: storeData, isLoading } = useQuery({
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

  const rawBusinessType =
    storeData?.businessType ||
    storeData?.partnerLead?.businessType ||
    profile?.partnerLead?.businessType ||
    "";

  const isOtherInitial = rawBusinessType.startsWith("Other:") || rawBusinessType === "Other";
  const initialBusinessType = isOtherInitial ? "Other" : rawBusinessType;
  const initialOtherBusinessType =
    (storeData as any)?.otherBusinessType ||
    (storeData?.partnerLead as any)?.otherBusinessType ||
    (profile?.partnerLead as any)?.otherBusinessType ||
    (rawBusinessType.startsWith("Other:") ? rawBusinessType.replace(/^Other:\s*/, "").trim() : "");

  const storeEmail =
    storeData?.storeManager?.email ||
    storeData?.partnerLead?.businessEmail ||
    storeData?.partnerLead?.email ||
    storeData?.email ||
    profile?.email ||
    "";

  const detectedTargetCountry = useMemo(() => {
    if (!storeData) return undefined;
    return (
      findPhoneCountry(storeData.countryName) ||
      findPhoneCountry(storeData.storeCountryCode) ||
      findPhoneCountry(storeData.country) ||
      findPhoneCountry(storeData.partnerLead?.country) ||
      findPhoneCountry(storeData.storeManager?.country) ||
      (storeData.storePhoneNumber
        ? resolveFromValue(storeData.storePhoneNumber).country
        : undefined)
    );
  }, [storeData]);

  const activePhoneIso = phoneIso || detectedTargetCountry?.isoCode || "US";

  const [pendingBusinessType, setPendingBusinessType] = useState<string | null>(null);
  const [imageConfirmOpen, setImageConfirmOpen] = useState(false);

  const updateStoreMutation = useUpdateStore(storeId || "");

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isDirty },
  } = useForm<StoreInfoValues>({
    resolver: zodResolver(storeInfoSchema),
    defaultValues: {
      businessType: initialBusinessType || "Retail Store",
      otherBusinessType: initialOtherBusinessType || "",
      storeName: "",
      storePhoneCode: "+91",
      storePhoneNumber: "",
      storeAddress: "",
      address2: "",
      storeCountry: "",
      storeState: "",
      storeCity: "",
      storeZipCode: "",
      sameDayDelivery: false,
      orderProcessingTime: "",
      perishableProducts: false,
      refrigeratedProducts: false,
      frozenProducts: false,
    },
  });

  const watchedBusinessType = useWatch({ control, name: "businessType" });
  const effectiveBusinessType = watchedBusinessType || initialBusinessType || "Retail Store";

  const handleBusinessTypeSelect = (newType: string) => {
    if (newType === effectiveBusinessType) return;

    if (newType !== "Other") {
      setValue("otherBusinessType", "", { shouldDirty: true });
    }

    const currentStoreImage = getValues("storeImage");
    const currentImageUrl =
      typeof currentStoreImage === "string"
        ? currentStoreImage
        : currentStoreImage instanceof File
          ? "CUSTOM_FILE"
          : "";

    const isOther = newType === "Other";
    const recommended = isOther
      ? { imageUrl: "/default-store.svg", label: "Default Store" }
      : getDefaultStoreImageForBusinessType(newType);

    if (recommended && currentImageUrl !== recommended.imageUrl) {
      setPendingBusinessType(newType);
      setImageConfirmOpen(true);
    } else {
      setValue("businessType", newType, { shouldDirty: true, shouldValidate: true });
    }
  };

  const handleConfirmUseRecommended = () => {
    if (pendingBusinessType) {
      const isOther = pendingBusinessType === "Other";
      const rec = isOther
        ? { imageUrl: "/default-store.svg", label: "Default Store" }
        : getDefaultStoreImageForBusinessType(pendingBusinessType);
      if (rec) {
        setValue("storeImage", rec.imageUrl, { shouldDirty: true, shouldValidate: true });
      }
      setValue("businessType", pendingBusinessType, { shouldDirty: true, shouldValidate: true });
      if (pendingBusinessType !== "Other") {
        setValue("otherBusinessType", "", { shouldDirty: true });
      }
    }
    setImageConfirmOpen(false);
    setPendingBusinessType(null);
  };

  const handleConfirmKeepExisting = () => {
    if (pendingBusinessType) {
      setValue("businessType", pendingBusinessType, { shouldDirty: true, shouldValidate: true });
      if (pendingBusinessType !== "Other") {
        setValue("otherBusinessType", "", { shouldDirty: true });
      }
    }
    setImageConfirmOpen(false);
    setPendingBusinessType(null);
  };

  useEffect(() => {
    if (storeData) {
      const targetCountry = detectedTargetCountry;
      const activeCountryCode =
        storeData.storeCountryCode || (targetCountry ? `+${targetCountry.dialCode}` : "+91");

      const cleanPhone = (code?: string | null, num?: string | null) => {
        if (!num) return "";
        let result = num.trim();
        if (code) {
          if (result.startsWith(code)) {
            result = result.slice(code.length).trim();
          } else {
            const cleanCode = code.replace(/\D/g, "");
            if (cleanCode && result.startsWith(cleanCode)) {
              result = result.slice(cleanCode.length).trim();
            }
          }
        }
        if (targetCountry?.dialCode && result.startsWith(targetCountry.dialCode)) {
          result = result.slice(targetCountry.dialCode.length).trim();
        }
        return result || "";
      };

      const getStoreLeadAddress = () => {
        try {
          const locsRaw = storeData?.partnerLead?.locations;
          if (!locsRaw) return null;
          let locs = locsRaw;
          if (typeof locsRaw === "string") {
            locs = JSON.parse(locsRaw);
          }
          return Array.isArray(locs) && locs[0] ? locs[0].address : null;
        } catch {
          return null;
        }
      };

      const currentRawBT =
        storeData.businessType ||
        storeData.partnerLead?.businessType ||
        profile?.partnerLead?.businessType ||
        "Retail Store";
      let initBT = currentRawBT;
      let initOther =
        (storeData as any).otherBusinessType ||
        (storeData?.partnerLead as any)?.otherBusinessType ||
        (profile?.partnerLead as any)?.otherBusinessType ||
        "";
      if (currentRawBT.startsWith("Other:")) {
        initBT = "Other";
        if (!initOther) {
          initOther = currentRawBT.replace(/^Other:\s*/, "").trim();
        }
      } else if (currentRawBT === "Other") {
        initBT = "Other";
      }

      reset({
        businessType: initBT,
        otherBusinessType: initOther,
        storeImage: storeData.storeImage,
        storeName: storeData.storeName || "",
        storePhoneCode: activeCountryCode,
        storePhoneNumber: cleanPhone(activeCountryCode, storeData.storePhoneNumber),
        storeAddress: getStoreLeadAddress() || storeData.address || storeData.storeAddress || "",
        storeCountry: storeData.country || "",
        storeState:
          storeData.state ||
          storeData.partnerLead?.stateProvince ||
          storeData.partnerLead?.stateProvinceRegion ||
          "",
        storeCity: storeData.city || "",
        storeZipCode: storeData.zipCode || storeData.partnerLead?.zipCode || "",
        sameDayDelivery: storeData.sameDayDelivery ?? false,
        orderProcessingTime: storeData.orderProcessingTime || "",
        perishableProducts:
          storeData.perishableProducts !== undefined && storeData.perishableProducts !== null
            ? storeData.perishableProducts === true
            : storeData.partnerLead?.perishableProducts === true,
        refrigeratedProducts:
          storeData.refrigeratedProducts !== undefined && storeData.refrigeratedProducts !== null
            ? storeData.refrigeratedProducts === true
            : storeData.partnerLead?.refrigeratedProducts === true,
        frozenProducts:
          storeData.frozenProducts !== undefined && storeData.frozenProducts !== null
            ? storeData.frozenProducts === true
            : storeData.partnerLead?.frozenProducts === true,
      });
    }
  }, [storeData, reset, detectedTargetCountry]);

  const onSubmit = async (values: StoreInfoValues) => {
    if (!storeId || needsBankVerification) return;

    try {
      const formData = new FormData();
      formData.append("storeName", values.storeName);
      if (values.businessType) {
        if (values.businessType === "Other" && values.otherBusinessType?.trim()) {
          formData.append("businessType", `Other: ${values.otherBusinessType.trim()}`);
          formData.append("otherBusinessType", values.otherBusinessType.trim());
        } else {
          formData.append("businessType", values.businessType);
        }
      }
      formData.append("storeCountryCode", values.storePhoneCode);
      formData.append("storePhoneNumber", values.storePhoneNumber);
      formData.append("sameDayDelivery", values.sameDayDelivery ? "true" : "false");
      if (values.orderProcessingTime) {
        formData.append("orderProcessingTime", values.orderProcessingTime);
      } else {
        formData.append("orderProcessingTime", "");
      }
      formData.append("perishableProducts", values.perishableProducts ? "true" : "false");
      formData.append("refrigeratedProducts", values.refrigeratedProducts ? "true" : "false");
      formData.append("frozenProducts", values.frozenProducts ? "true" : "false");

      const storeImageFile = Array.isArray(values.storeImage)
        ? values.storeImage[0]
        : values.storeImage;

      const currentBT = values.businessType || effectiveBusinessType;
      const defaultStoreImage =
        currentBT && currentBT !== "Other"
          ? getDefaultStoreImageForBusinessType(currentBT)?.imageUrl || "/default-store.svg"
          : "/default-store.svg";

      if (storeImageFile instanceof File) {
        formData.append("storeImage", storeImageFile);
      } else if (typeof storeImageFile === "string" && storeImageFile.trim()) {
        formData.append("storeImage", storeImageFile.trim());
      } else {
        formData.append("storeImage", defaultStoreImage);
      }

      const res = await updateStoreMutation.mutateAsync(formData as any);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["store", storeId] }),
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.ADMIN_PROFILE }),
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.STORES }),
        queryClient.invalidateQueries({ queryKey: ["stores"] }),
      ]);
      refetchProfile();
      successToast({ title: "Store information updated successfully!" });
      const newStoreImage =
        (res as any)?.data?.storeImage ||
        (res as any)?.storeImage ||
        (typeof storeImageFile === "string" && storeImageFile.trim()
          ? storeImageFile
          : defaultStoreImage);
      reset({
        ...values,
        storeImage: newStoreImage,
      });
    } catch {}
  };

  if (isLoading) {
    return (
      <Card className="flex h-64 items-center justify-center rounded-3xl border border-white/60 bg-white/50 p-8 shadow-[0_8px_30px_rgba(14,42,75,0.04)] backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/40">
        <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 dark:border-slate-700"></div>
      </Card>
    );
  }

  if (!storeId) return null;

  const partnerLead = profile?.partnerLead;

  return (
    <div className="space-y-6 pb-28">
      <form id="store-info-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <fieldset
          disabled={needsBankVerification}
          className="min-w-0 space-y-6 border-0 p-0 disabled:opacity-90"
        >
          <Card className="brand-glass-card rounded-3xl border border-white/60 shadow-[0_8px_30px_rgba(14,42,75,0.04)] backdrop-blur-xl dark:border-slate-800/60">
            <CardHeader className="border-b border-slate-200/60 bg-slate-50/50 px-4 py-4 sm:px-8 sm:py-6 dark:border-slate-800/60 dark:bg-slate-900/40">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  <Building2 className="size-5" />
                </div>
                <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg font-bold tracking-tight text-slate-800 sm:text-xl dark:text-slate-100">
                      Store Details
                    </CardTitle>
                    <CardDescription className="text-xs font-medium text-slate-500 sm:text-sm dark:text-slate-400">
                      Basic information and contact details of the store
                    </CardDescription>
                  </div>
                  {storeData?.storeId && (
                    <div className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white/80 px-2.5 py-1 font-mono text-xs font-semibold text-slate-700 shadow-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      <span className="text-slate-400">Store ID:</span>
                      <span className="text-primary font-bold">{storeData.storeId}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 p-4 sm:p-8">
              <StoreImageField
                control={control}
                errors={errors}
                needsBankVerification={needsBankVerification}
                isEmployee={isEmployee}
                businessType={effectiveBusinessType}
              />

              <div className="grid grid-cols-1 gap-4 pt-2 sm:gap-6 md:grid-cols-2">
                <Controller
                  name="storeName"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1.5">
                      <FieldLabel className="text-sm font-semibold">
                        Store Name <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="Enter Store Name"
                        disabled={needsBankVerification}
                        className={cn(
                          "h-12 rounded-xl border-gray-200/80 bg-gray-50/50 text-sm",
                          "focus-visible:border-[#1B3A8C] focus-visible:bg-white focus-visible:shadow-[0_0_0_4px_rgba(27,58,140,0.1)] focus-visible:ring-[#1B3A8C]/20",
                          "disabled:cursor-not-allowed disabled:opacity-60",
                          errors.storeName &&
                            "border-red-400 bg-red-50 focus-visible:border-red-400 focus-visible:ring-red-400/15",
                        )}
                      />
                      {errors.storeName ? (
                        <p className="text-xs font-medium text-red-500">
                          {errors.storeName.message}
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-400">
                          Commercial public name of your store.
                        </p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="businessType"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1.5">
                      <FieldLabel htmlFor="businessType" className="text-sm font-semibold">
                        Business Type <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Select
                        value={field.value || effectiveBusinessType}
                        onValueChange={(val) => {
                          if (!val) return;
                          handleBusinessTypeSelect(val);
                        }}
                        disabled={needsBankVerification}
                      >
                        <SelectTrigger
                          id="businessType"
                          className="h-12 w-full rounded-xl border border-gray-200/80 bg-white text-sm font-medium shadow-xs hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                        >
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent className="max-h-64">
                          {BUSINESS_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              <div className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-emerald-500" />
                                <span>{type}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-[11px] text-slate-400">
                        Operating business category. Changing category recommends a matching
                        storefront image.
                      </p>
                    </div>
                  )}
                />

                {effectiveBusinessType === "Other" && (
                  <Controller
                    name="otherBusinessType"
                    control={control}
                    render={({ field }) => (
                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <FieldLabel htmlFor="otherBusinessType" className="text-sm font-semibold">
                          Please Specify Business Type <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="otherBusinessType"
                          placeholder="e.g. Food Truck, Specialty Bakery, Cloud Kitchen"
                          disabled={needsBankVerification}
                          aria-invalid={!!errors.otherBusinessType}
                          className={cn(
                            "h-12 rounded-xl border-gray-200/80 bg-gray-50/50 text-sm",
                            "focus-visible:border-[#1B3A8C] focus-visible:bg-white focus-visible:shadow-[0_0_0_4px_rgba(27,58,140,0.1)] focus-visible:ring-[#1B3A8C]/20",
                            "disabled:cursor-not-allowed disabled:opacity-60",
                            errors.otherBusinessType &&
                              "border-red-400 bg-red-50 focus-visible:border-red-400 focus-visible:ring-red-400/15",
                          )}
                        />
                        {errors.otherBusinessType ? (
                          <p className="text-xs font-medium text-red-500">
                            {errors.otherBusinessType.message}
                          </p>
                        ) : (
                          <p className="text-[11px] text-slate-400">
                            Specify your custom business classification.
                          </p>
                        )}
                      </div>
                    )}
                  />
                )}

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <FieldLabel className="text-sm font-semibold">Store Email</FieldLabel>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/80 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-400">
                      <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                      Verified
                    </span>
                  </div>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={storeEmail}
                      readOnly
                      disabled
                      placeholder="No email registered"
                      className="h-12 rounded-xl border-gray-200/80 bg-gray-100/70 pl-10 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-85 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <p className="flex items-start gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                    <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>
                      <strong>Profile Account Email:</strong> Synced from your profile email (cannot
                      be edited here).
                    </span>
                  </p>
                </div>

                <StorePhoneField
                  control={control}
                  errors={errors}
                  activePhoneIso={activePhoneIso}
                  needsBankVerification={needsBankVerification}
                  onPhoneIsoChange={setPhoneIso}
                  showVerifiedBadge={true}
                  disabled={true}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="brand-glass-card rounded-3xl border border-white/60 shadow-[0_8px_30px_rgba(14,42,75,0.04)] backdrop-blur-xl dark:border-slate-800/60">
            <CardHeader className="border-b border-slate-200/60 bg-slate-50/50 px-4 py-4 sm:px-8 sm:py-6 dark:border-slate-800/60 dark:bg-slate-900/40">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold tracking-tight text-slate-800 sm:text-xl dark:text-slate-100">
                      Store Location & Address
                    </CardTitle>
                    <CardDescription className="text-xs font-medium text-slate-500 sm:text-sm dark:text-slate-400">
                      Physical address and regional location details of the store.
                    </CardDescription>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/80 px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <Lock className="size-3 text-slate-400" />
                  <span>Permanent Store Location</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-8">
              <StoreLocationFields
                control={control}
                errors={errors}
                setValue={setValue}
                onPhoneIsoChange={setPhoneIso}
              />
            </CardContent>
          </Card>

          <Card className="brand-glass-card rounded-3xl border border-white/60 shadow-[0_8px_30px_rgba(14,42,75,0.04)] backdrop-blur-xl dark:border-slate-800/60">
            <CardHeader className="border-b border-slate-200/60 bg-slate-50/50 px-4 py-4 sm:px-8 sm:py-6 dark:border-slate-800/60 dark:bg-slate-900/40">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
                  <Truck className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold tracking-tight text-slate-800 sm:text-xl dark:text-slate-100">
                    Fulfillment & Product Preferences
                  </CardTitle>
                  <CardDescription className="text-xs font-medium text-slate-500 sm:text-sm dark:text-slate-400">
                    Configure same-day delivery availability, preparation times, and product
                    handling.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 p-4 sm:p-8">
              <StoreSameDayDeliveryFields control={control} errors={errors} setValue={setValue} />

              <StoreProductScreeningFields
                control={control}
                setValue={setValue}
                disabled={isEmployee}
              />
            </CardContent>
          </Card>
        </fieldset>
      </form>

      <div className="grid max-w-full min-w-0 grid-cols-1 gap-6 md:grid-cols-2">
        <ProfileBankVerification />
        {partnerLead && <KycVerificationCard lead={partnerLead} />}
        <div className="min-w-0 md:col-span-2">
          <OperationalPreferencesCard lead={partnerLead} hideFulfillmentAndScreening />
        </div>
        {partnerLead && <AdditionalDocumentsCard lead={partnerLead} />}
        {partnerLead && <LocationDetailsCard lead={partnerLead} />}
      </div>

      {/* Fixed Floating Save Action Bar - Centered with comfortable width */}
      {!needsBankVerification && (
        <div
          style={{
            left: isMobile ? 0 : sidebarOffset,
            right: 0,
          }}
          className="pointer-events-none fixed bottom-5 z-40 flex justify-center px-4 transition-all duration-200"
        >
          <div className="pointer-events-auto flex w-full max-w-2xl items-center justify-between gap-4 rounded-2xl border border-white/80 bg-white/95 px-6 py-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:min-w-140 dark:border-slate-800/90 dark:bg-slate-900/95 dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2 pl-2">
              {isDirty ? (
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <span className="size-2 animate-pulse rounded-full bg-amber-500" />
                  Unsaved changes
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  All details saved
                </span>
              )}
            </div>
            <Button
              form="store-info-form"
              type="submit"
              disabled={!isDirty || updateStoreMutation.isPending}
              isLoading={updateStoreMutation.isPending}
              className="h-11 rounded-xl bg-[#1B3A8C] text-sm font-bold text-white hover:bg-[#1B3A8C]/90 hover:shadow-lg dark:bg-indigo-600 dark:hover:bg-indigo-700"
            >
              <Check className="h-4 w-4" />
              {updateStoreMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      )}

      <Dialog
        open={imageConfirmOpen}
        onOpenChange={(open) => {
          setImageConfirmOpen(open);
          if (!open) {
            setPendingBusinessType(null);
          }
        }}
      >
        <DialogContent className="max-w-lg overflow-hidden rounded-2xl p-0">
          <DialogHeader className="border-b border-slate-100 bg-linear-to-r from-emerald-50/60 via-white to-slate-50 p-6 pb-4 dark:border-slate-800 dark:from-slate-900 dark:to-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <Sparkles className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Update Storefront Image?
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                  You selected{" "}
                  <strong className="font-semibold text-emerald-700 dark:text-emerald-400">
                    &quot;{pendingBusinessType}&quot;
                  </strong>
                  .
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {(() => {
            const isOther = pendingBusinessType === "Other";
            const recommended = isOther
              ? { imageUrl: "/default-store.svg", label: "Default Store Placeholder" }
              : pendingBusinessType
                ? getDefaultStoreImageForBusinessType(pendingBusinessType)
                : null;
            const currentImg = getValues("storeImage");
            const currentDisplayUrl =
              typeof currentImg === "string" && currentImg.trim()
                ? currentImg
                : currentImg instanceof File
                  ? URL.createObjectURL(currentImg)
                  : "/default-store.svg";

            return (
              <div className="space-y-4 p-6">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {isOther ? (
                    <span>
                      You selected <strong>Other</strong> business type. Would you like to switch to
                      the standard default store image, keep your existing image, or upload a custom
                      image?
                    </span>
                  ) : (
                    <span>
                      We found a recommended storefront image for{" "}
                      <strong>{pendingBusinessType}</strong>. Would you like to change your store
                      image to this recommended image or keep your existing image?
                    </span>
                  )}
                </p>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {recommended && (
                    <div
                      onClick={handleConfirmUseRecommended}
                      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-emerald-300 bg-emerald-50/30 p-3 shadow-xs transition hover:border-emerald-600 hover:shadow-md dark:border-emerald-800 dark:bg-emerald-950/20"
                    >
                      <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                        <Image
                          src={recommended.imageUrl}
                          alt={recommended.label}
                          fill
                          unoptimized
                          className="object-cover transition duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-2 right-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                          {isOther ? "Default" : "Recommended"}
                        </div>
                      </div>
                      <p className="mt-2.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                        {recommended.label}
                      </p>
                      <p className="line-clamp-1 text-[11px] text-slate-500 dark:text-slate-400">
                        {isOther ? "System default placeholder" : "Category preset image"}
                      </p>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleConfirmUseRecommended}
                        className="mt-3 h-8 w-full rounded-lg bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700"
                      >
                        {isOther ? "Use Default Image" : "Change Image"}
                      </Button>
                    </div>
                  )}

                  <div
                    onClick={handleConfirmKeepExisting}
                    className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-xs transition hover:border-slate-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                      <Image
                        src={currentDisplayUrl}
                        alt="Current store image"
                        fill
                        unoptimized
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2 rounded-full bg-slate-700/80 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                        Existing
                      </div>
                    </div>
                    <p className="mt-2.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                      Existing Image
                    </p>
                    <p className="line-clamp-1 text-[11px] text-slate-500 dark:text-slate-400">
                      Retain current image
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleConfirmKeepExisting}
                      className="mt-3 h-8 w-full rounded-lg text-xs font-semibold"
                    >
                      Keep Existing
                    </Button>
                  </div>
                </div>

                {isOther && (
                  <div className="rounded-xl border border-amber-200/80 bg-amber-50/70 p-2.5 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
                    💡 <strong>Custom Image:</strong> You can also upload your own store logo or
                    photo anytime in the Store Image section below.
                  </div>
                )}
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
