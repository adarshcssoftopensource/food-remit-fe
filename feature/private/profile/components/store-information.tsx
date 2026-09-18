"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/common/image-upload";
import { PhoneInputComponent } from "@/components/ui/phone-input";
import { AddressAutocompleteInput } from "@/components/common/address-autocomplete-input";
import { CountryCityFields } from "@/feature/private/store-management/components/country-city-fields";

import { useProfile } from "@/components/providers/profile-provider";
import { useUpdateStore } from "@/feature/private/store-management/hooks/use-update-store";
import { successToast } from "@/components/toaster";
import { fetcher } from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

const storeInfoSchema = z.object({
  storeImage: z.any().optional(),
  storeName: z.string().min(1, "Store name is required"),
  storePhoneCode: z.string().min(1, "Country code is required"),
  storePhoneNumber: z.string().min(1, "Phone number is required"),
  storeAddress: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  storeCountry: z.string().min(1, "Country is required"),
  storeCity: z.string().min(1, "City is required"),
});

type StoreInfoValues = z.infer<typeof storeInfoSchema>;

export function StoreInformation() {
  const { profile } = useProfile();
  const storeId = profile?.stores?.[0]?.id;

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

  const updateStoreMutation = useUpdateStore(storeId || "");

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<StoreInfoValues>({
    resolver: zodResolver(storeInfoSchema),
    defaultValues: {
      storeName: "",
      storePhoneCode: "+91",
      storePhoneNumber: "",
      storeAddress: "",
      address2: "",
      storeCountry: "",
      storeCity: "",
    },
  });

  useEffect(() => {
    if (storeData) {
      const cleanPhone = (code?: string | null, num?: string | null) => {
        if (!code || !num) return num ?? "";
        let result = num.trim();
        if (result.startsWith(code)) {
          result = result.slice(code.length).trim();
        } else {
          const cleanCode = code.replace(/\D/g, "");
          if (cleanCode && result.startsWith(cleanCode)) {
            const stripped = result.slice(cleanCode.length).trim();
            if (stripped.length >= 10) result = stripped;
          }
        }
        return result || "";
      };

      reset({
        storeImage: storeData.storeImage,
        storeName: storeData.storeName || "",
        storePhoneCode: storeData.storeCountryCode || "+91",
        storePhoneNumber: cleanPhone(
          storeData.storeCountryCode || "+91",
          storeData.storePhoneNumber,
        ),
        storeAddress: storeData.storeAddress || "",
        storeCountry: storeData.country || "",
        storeCity: storeData.city || "",
      });
    }
  }, [storeData, reset]);

  const onSubmit = async (values: StoreInfoValues) => {
    if (!storeId) return;

    try {
      const formData = new FormData();
      formData.append("storeName", values.storeName);
      formData.append("storeCountryCode", values.storePhoneCode);
      formData.append("storePhoneNumber", values.storePhoneNumber);
      formData.append("storeAddress", values.storeAddress);
      formData.append("country", values.storeCountry);
      formData.append("city", values.storeCity);

      const storeImageFile = Array.isArray(values.storeImage)
        ? values.storeImage[0]
        : values.storeImage;

      if (storeImageFile instanceof File) {
        formData.append("storeImage", storeImageFile);
      } else if (typeof storeImageFile === "string" && storeImageFile !== storeData?.storeImage) {
        formData.append("storeImage", storeImageFile);
      }

      await updateStoreMutation.mutateAsync(formData as any);
      successToast({ title: "Store information updated successfully!" });
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

  return (
    <Card className="brand-glass-card rounded-3xl border border-white/60 shadow-[0_8px_30px_rgba(14,42,75,0.04)] backdrop-blur-xl dark:border-slate-800/60">
      <CardHeader className="border-b border-slate-200/60 bg-slate-50/50 px-4 py-4 sm:px-8 sm:py-6 dark:border-slate-800/60 dark:bg-slate-900/40">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <Building2 className="size-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold tracking-tight text-slate-800 sm:text-xl dark:text-slate-100">
              Store Details
            </CardTitle>
            <CardDescription className="text-xs font-medium text-slate-500 sm:text-sm dark:text-slate-400">
              Basic information about the store
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="storeImage"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <FieldLabel className="text-sm font-semibold">
                  Store Image <span className="text-red-500">*</span>
                </FieldLabel>
                <ImageUpload
                  value={
                    field.value && typeof field.value !== "string" ? [field.value as File] : []
                  }
                  onChange={(files) => field.onChange(files[0] || null)}
                  onAllImagesChange={(all) => {
                    if (all.length === 0) field.onChange(null);
                  }}
                  initialImages={typeof field.value === "string" ? [field.value] : []}
                  maxFiles={1}
                  multiple={false}
                  label="Upload store image"
                  hint="PNG, JPG or WEBP"
                  accept="image/jpeg,image/png,image/webp"
                />
                {errors.storeImage && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.storeImage.message as string}
                  </p>
                )}
              </div>
            )}
          />

          <div className="space-y-6">
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
                    className={cn(
                      "h-12 rounded-xl border-gray-200/80 bg-gray-50/50 text-sm",
                      "focus-visible:border-[#1B3A8C] focus-visible:bg-white focus-visible:shadow-[0_0_0_4px_rgba(27,58,140,0.1)] focus-visible:ring-[#1B3A8C]/20",
                      errors.storeName &&
                        "border-red-400 bg-red-50 focus-visible:border-red-400 focus-visible:ring-red-400/15",
                    )}
                  />
                  {errors.storeName && (
                    <p className="text-xs font-medium text-red-500">{errors.storeName.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="storePhoneNumber"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <FieldLabel className="text-sm font-semibold">
                    Store Phone Number <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Controller
                    name="storePhoneCode"
                    control={control}
                    render={({ field: codeField }) => (
                      <PhoneInputComponent
                        defaultCountry={
                          codeField.value ||
                          storeData?.storeCountryCode ||
                          storeData?.country ||
                          undefined
                        }
                        value={`${codeField.value || ""}${field.value || ""}`}
                        onChange={(val, data) => {
                          if (data) {
                            codeField.onChange(`+${data.dialCode}`);
                            const national = val.startsWith(data.dialCode)
                              ? val.slice(data.dialCode.length)
                              : val;
                            field.onChange(national);
                          } else {
                            field.onChange(val);
                          }
                        }}
                        error={!!errors.storePhoneNumber}
                      />
                    )}
                  />
                  {errors.storePhoneNumber && (
                    <p className="text-xs font-medium text-red-500">
                      {errors.storePhoneNumber.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="storeCountry"
              control={control}
              render={({ field: countryField }) => (
                <Controller
                  name="storeCity"
                  control={control}
                  render={({ field: cityField }) => (
                    <CountryCityFields
                      prefix="store"
                      countryValue={countryField.value}
                      cityValue={cityField.value}
                      onCountryChange={(val) => {
                        countryField.onChange(val);
                        cityField.onChange("");
                      }}
                      onCityChange={cityField.onChange}
                      countryError={errors.storeCountry?.message}
                      cityError={errors.storeCity?.message}
                    />
                  )}
                />
              )}
            />

            <Controller
              name="storeAddress"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <FieldLabel className="text-sm font-semibold">
                    Address <span className="text-red-500">*</span>
                  </FieldLabel>
                  <AddressAutocompleteInput
                    value={field.value}
                    onChange={field.onChange}
                    onPlaceSelect={(place) => {
                      field.onChange(place.formattedAddress);
                      if (place.country) setValue("storeCountry", place.country);
                      if (place.city) setValue("storeCity", place.city);
                    }}
                    placeholder="Enter Address"
                    invalid={!!errors.storeAddress}
                  />
                  {errors.storeAddress && (
                    <p className="text-xs font-medium text-red-500">
                      {errors.storeAddress.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-6 dark:border-slate-800">
            <Button
              type="submit"
              disabled={updateStoreMutation.isPending}
              className="h-12 w-full rounded-xl bg-[#1B3A8C] px-8 text-sm font-bold text-white shadow-md transition-all hover:bg-[#1B3A8C]/90 hover:shadow-lg sm:w-auto dark:bg-indigo-600 dark:hover:bg-indigo-700"
            >
              {updateStoreMutation.isPending ? "Saving changes..." : "Save Store Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
