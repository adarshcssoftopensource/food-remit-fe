"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useProfile } from "@/components/providers/profile-provider";
import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateProfile } from "../hooks/use-update-profile";
import { getProfileDetailsSchema, type ProfileDetailsValues } from "../schema/profile.schema";
import {
  EmployeeLocationSection,
  ProfileAddressField,
  ProfileContactField,
  ProfileEmailField,
  ProfileNameField,
  StoreManagerLocationFields,
} from "./profile-form-fields";
import { getProfileFormValues } from "./profile-form-values";

export function ProfileForm() {
  const { profile, needsBankVerification } = useProfile();
  const queryClient = useQueryClient();
  const updateProfileMutation = useUpdateProfile();
  const isEmployee = profile?.roleCode === "EMPLOYEE" || profile?.role === "employee";
  const isStoreManager = profile?.roleCode === "STORE_MANAGER" || profile?.role === "store_manager";
  const [phoneIso, setPhoneIso] = useState<string | undefined>(undefined);

  const { phoneFallbackCountry, values } = getProfileFormValues(profile);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileDetailsValues>({
    resolver: zodResolver(getProfileDetailsSchema(isStoreManager)),
    values,
    mode: "onChange",
  });

  const isSubmitting = updateProfileMutation.isPending;

  const onSubmit = async (data: ProfileDetailsValues) => {
    if (needsBankVerification) return;
    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("name", `${data.firstName} ${data.lastName}`.trim());

      if (!isStoreManager) {
        if (data.address !== undefined) formData.append("address", data.address);
        if (data.country !== undefined) formData.append("country", data.country);
        if (data.state !== undefined) formData.append("state", data.state);
        if (data.city !== undefined) formData.append("city", data.city);
        if (data.zipCode !== undefined) formData.append("zipCode", data.zipCode);
      }

      await updateProfileMutation.mutateAsync(formData);
      successToast({ title: "Profile updated successfully!" });
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.ADMIN_PROFILE });
      reset(data); // reset isDirty
    } catch {}
  };

  return (
    <Card className="brand-glass-card rounded-3xl border border-white/60 shadow-[0_8px_30px_rgba(14,42,75,0.04)] backdrop-blur-xl dark:border-slate-800/60">
      <CardHeader className="border-b border-slate-200/60 bg-slate-50/50 px-4 py-4 sm:px-8 sm:py-6 dark:border-slate-800/60 dark:bg-slate-900/40">
        <CardTitle className="text-lg font-bold tracking-tight text-slate-800 sm:text-xl dark:text-slate-100">
          Personal Information
        </CardTitle>
        <CardDescription className="text-xs font-medium text-slate-500 sm:text-sm dark:text-slate-400">
          Update your personal details and contact information.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} noValidate suppressHydrationWarning>
          <fieldset
            disabled={needsBankVerification}
            className="min-w-0 border-0 p-0 disabled:opacity-90"
          >
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
              <ProfileNameField
                control={control}
                errors={errors}
                name="firstName"
                label="First Name"
                placeholder="Enter your first name"
              />

              <ProfileNameField
                control={control}
                errors={errors}
                name="lastName"
                label="Last Name"
                placeholder="Enter your last name"
              />

              <ProfileEmailField control={control} />

              <ProfileContactField
                control={control}
                errors={errors}
                phoneIso={phoneIso}
                onPhoneIsoChange={setPhoneIso}
                fallbackCountry={phoneFallbackCountry}
              />

              {isEmployee ? (
                <EmployeeLocationSection control={control} errors={errors} setValue={setValue} />
              ) : (
                <ProfileAddressField
                  control={control}
                  errors={errors}
                  isStoreManager={isStoreManager}
                />
              )}

              {isStoreManager && <StoreManagerLocationFields control={control} errors={errors} />}
            </div>

            {!needsBankVerification && (
              <div className="mt-8 flex justify-end">
                <Button
                  type="submit"
                  disabled={!isDirty || isSubmitting}
                  isLoading={isSubmitting}
                  className="h-14 w-full rounded-xl text-base font-bold shadow-sm transition-colors sm:w-auto sm:px-10"
                >
                  <Check className="mr-2 h-5 w-5" />
                  Save Changes
                </Button>
              </div>
            )}
          </fieldset>
        </form>
      </CardContent>
    </Card>
  );
}
