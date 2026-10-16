"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { successToast } from "@/components/toaster";
import { findPhoneCountry, resolveFromValue } from "@/components/ui/phone-input-utils";
import { useSidebar } from "@/components/ui/sidebar";
import { getDefaultStoreImageForBusinessType } from "@/constants/default-store-images";
import { useUpdateStore } from "@/feature/private/(super-admin)/store-management/hooks/use-update-store";
import { fetcher } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { useProfile } from "@/providers/profile-provider";
import { storeInfoSchema, type StoreInfoValues } from "../schema/store-info.schema";

export function useStoreInformation() {
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
          if (Array.isArray(locs) && locs.length > 0) {
            return locs[0];
          }
          return null;
        } catch {
          return null;
        }
      };

      const leadLoc = getStoreLeadAddress();

      const resolvedStoreAddress =
        storeData.storeAddress ||
        storeData.address ||
        leadLoc?.address ||
        storeData.partnerLead?.address ||
        "";

      const resolvedStoreState =
        storeData.storeState ||
        storeData.state ||
        leadLoc?.state ||
        storeData.partnerLead?.state ||
        "";

      const resolvedStoreCity =
        storeData.storeCity || storeData.city || leadLoc?.city || storeData.partnerLead?.city || "";

      const resolvedStoreZip =
        storeData.storeZipCode ||
        storeData.zipCode ||
        leadLoc?.zipCode ||
        leadLoc?.postalCode ||
        storeData.partnerLead?.zipCode ||
        storeData.partnerLead?.postalCode ||
        "";

      const resolvedStoreCountry =
        storeData.storeCountry ||
        storeData.country ||
        leadLoc?.country ||
        storeData.partnerLead?.country ||
        (targetCountry ? targetCountry.isoCode : "");

      const businessTypeBackend =
        storeData.businessType ||
        storeData.partnerLead?.businessType ||
        profile?.partnerLead?.businessType ||
        "";

      const isOther = businessTypeBackend.startsWith("Other:") || businessTypeBackend === "Other";
      const resolvedBusinessType = isOther ? "Other" : businessTypeBackend || "Retail Store";
      const resolvedOtherBusinessType =
        (storeData as any)?.otherBusinessType ||
        (storeData?.partnerLead as any)?.otherBusinessType ||
        (profile?.partnerLead as any)?.otherBusinessType ||
        (businessTypeBackend.startsWith("Other:")
          ? businessTypeBackend.replace(/^Other:\s*/, "").trim()
          : "");

      reset({
        businessType: resolvedBusinessType,
        otherBusinessType: resolvedOtherBusinessType,
        storeName:
          storeData.storeName || storeData.name || storeData.partnerLead?.businessName || "",
        storeImage: storeData.storeImage || "",
        storePhoneCode: activeCountryCode,
        storePhoneNumber: cleanPhone(activeCountryCode, storeData.storePhoneNumber),
        storeAddress: resolvedStoreAddress,
        address2: storeData.address2 || "",
        storeCountry: resolvedStoreCountry,
        storeState: resolvedStoreState,
        storeCity: resolvedStoreCity,
        storeZipCode: resolvedStoreZip,
        sameDayDelivery: storeData.sameDayDelivery ?? false,
        orderProcessingTime: storeData.orderProcessingTime || "",
        perishableProducts: storeData.perishableProducts ?? false,
        refrigeratedProducts: storeData.refrigeratedProducts ?? false,
        frozenProducts: storeData.frozenProducts ?? false,
      });
    }
  }, [storeData, detectedTargetCountry, reset, profile]);

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
    } catch (error) {
      console.error("Failed to update store info:", error);
    }
  };

  return {
    profile,
    storeData,
    storeId,
    needsBankVerification,
    isEmployee,
    isLoading,
    isMobile,
    sidebarOffset,
    control,
    errors,
    isDirty,
    handleSubmit,
    setValue,
    getValues,
    onSubmit,
    isPending: updateStoreMutation.isPending,
    effectiveBusinessType,
    storeEmail,
    activePhoneIso,
    setPhoneIso,
    handleBusinessTypeSelect,
    imageConfirmOpen,
    setImageConfirmOpen,
    pendingBusinessType,
    setPendingBusinessType,
    handleConfirmUseRecommended,
    handleConfirmKeepExisting,
    partnerLead: profile?.partnerLead,
  };
}
