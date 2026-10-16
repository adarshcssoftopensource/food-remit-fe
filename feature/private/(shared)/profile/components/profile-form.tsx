"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Lock, MapPin, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useProfile } from "@/providers/profile-provider";
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
    resolver: zodResolver(getProfileDetailsSchema()),
    values,
    mode: "onChange",
  });

  const isSubmitting = updateProfileMutation.isPending;

  const onSubmit = async (data: ProfileDetailsValues) => {
    if (needsBankVerification) return;
    try {
      const formData = new FormData();
      const firstName = data.firstName.trim();
      const lastName = data.lastName.trim();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("name", `${firstName} ${lastName}`.trim());

      if (!isStoreManager) {
        if (data.address?.trim()) formData.append("address", data.address.trim());
        if (data.country?.trim()) formData.append("country", data.country.trim());
        if (data.state?.trim()) formData.append("state", data.state.trim());
        if (data.city?.trim()) formData.append("city", data.city.trim());
        if (data.zipCode?.trim()) formData.append("zipCode", data.zipCode.trim());
      }

      await updateProfileMutation.mutateAsync(formData);
      successToast({ title: "Profile updated successfully!" });
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.ADMIN_PROFILE });
      reset(data); // reset isDirty
    } catch {}
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      suppressHydrationWarning
      className="space-y-6"
    >
      <fieldset
        disabled={needsBankVerification}
        className="min-w-0 space-y-6 border-0 p-0 disabled:opacity-90"
      >
        <Card className="brand-glass-card rounded-3xl border border-white/60 shadow-[0_8px_30px_rgba(14,42,75,0.04)] backdrop-blur-xl dark:border-slate-800/60">
          <CardHeader className="border-b border-slate-200/60 bg-slate-50/50 px-4 py-4 sm:px-8 sm:py-6 dark:border-slate-800/60 dark:bg-slate-900/40">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                <User className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold tracking-tight text-slate-800 sm:text-xl dark:text-slate-100">
                  Personal Information
                </CardTitle>
                <CardDescription className="text-xs font-medium text-slate-500 sm:text-sm dark:text-slate-400">
                  Update your personal details and contact information.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-8">
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

              {isEmployee && (
                <EmployeeLocationSection
                  control={control}
                  errors={errors}
                  setValue={setValue}
                  fallbackCountry={phoneFallbackCountry}
                />
              )}

              {!isStoreManager && !isEmployee && null}
            </div>
          </CardContent>
        </Card>

        {isStoreManager && (
          <Card className="brand-glass-card rounded-3xl border border-white/60 shadow-[0_8px_30px_rgba(14,42,75,0.04)] backdrop-blur-xl dark:border-slate-800/60">
            <CardHeader className="border-b border-slate-200/60 bg-slate-50/50 px-4 py-4 sm:px-8 sm:py-6 dark:border-slate-800/60 dark:bg-slate-900/40">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold tracking-tight text-slate-800 sm:text-xl dark:text-slate-100">
                      Residential Address
                    </CardTitle>
                    <CardDescription className="text-xs font-medium text-slate-500 sm:text-sm dark:text-slate-400">
                      Your registered residential address and location details.
                    </CardDescription>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/80 px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <Lock className="size-3 text-slate-400" />
                  <span>Permanent Address</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-8">
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                <ProfileAddressField
                  control={control}
                  errors={errors}
                  isStoreManager={isStoreManager}
                />
                <StoreManagerLocationFields control={control} errors={errors} />
              </div>
            </CardContent>
          </Card>
        )}

        {!needsBankVerification && (
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={!isDirty || isSubmitting}
              isLoading={isSubmitting}
              className="h-12 w-full rounded-xl text-sm font-bold shadow-sm transition-colors sm:w-auto sm:px-8"
            >
              <Check className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}
      </fieldset>
    </form>
  );
}
