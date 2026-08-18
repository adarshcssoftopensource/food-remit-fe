"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Mail, User } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { useProfile } from "@/components/providers/profile-provider";
import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PhoneInputComponent } from "@/components/ui/phone-input";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateProfile } from "../hooks/use-update-profile";
import { profileDetailsSchema, type ProfileDetailsValues } from "../schema/profile.schema";

export function ProfileForm() {
  const { profile } = useProfile();
  const queryClient = useQueryClient();
  const updateProfileMutation = useUpdateProfile();

  const nameParts = (profile?.name || "").trim().split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileDetailsValues>({
    resolver: zodResolver(profileDetailsSchema),
    values: {
      firstName,
      lastName,
      email: profile?.email || "",
      contactNumber: profile?.phoneNumber || "",
    },
    mode: "onChange",
  });

  const isSubmitting = updateProfileMutation.isPending;

  const onSubmit = async (data: ProfileDetailsValues) => {
    try {
      await updateProfileMutation.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        contactNumber: data.contactNumber,
      });
      successToast({ title: "Profile updated successfully!" });
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.ADMIN_PROFILE });
      reset(data); // reset isDirty
    } catch {}
  };

  return (
    <Card className="brand-glass-card rounded-3xl border border-white/60 shadow-[0_8px_30px_rgba(14,42,75,0.04)] backdrop-blur-xl dark:border-slate-800/60">
      <CardHeader className="border-b border-slate-200/60 bg-slate-50/50 px-8 py-6 dark:border-slate-800/60 dark:bg-slate-900/40">
        <CardTitle className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Personal Information
        </CardTitle>
        <CardDescription className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Update your personal details and contact information.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} noValidate suppressHydrationWarning>
          <div className="grid gap-6 md:grid-cols-2">
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <FieldLabel htmlFor="firstName" className="text-sm font-semibold">
                    First Name
                  </FieldLabel>
                  <div className="relative">
                    <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                      {...field}
                      id="firstName"
                      placeholder="Enter your first name"
                      aria-invalid={!!errors.firstName}
                      className={cn(
                        "h-12 rounded-xl border-gray-200/80 bg-gray-50/50 pl-10 text-sm transition-all duration-300 placeholder:text-gray-400/80",
                        "focus-visible:border-[#1B3A8C] focus-visible:bg-white focus-visible:shadow-[0_0_0_4px_rgba(27,58,140,0.1)] focus-visible:ring-[#1B3A8C]/20",
                        errors.firstName &&
                          "border-red-400 bg-red-50 focus-visible:border-red-400 focus-visible:shadow-[0_0_0_4px_rgba(248,113,113,0.1)] focus-visible:ring-red-400/15",
                      )}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-xs font-medium text-red-500">{errors.firstName.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <FieldLabel htmlFor="lastName" className="text-sm font-semibold">
                    Last Name
                  </FieldLabel>
                  <div className="relative">
                    <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                      {...field}
                      id="lastName"
                      placeholder="Enter your last name"
                      aria-invalid={!!errors.lastName}
                      className={cn(
                        "h-12 rounded-xl border-gray-200/80 bg-gray-50/50 pl-10 text-sm transition-all duration-300 placeholder:text-gray-400/80",

                        "focus-visible:border-[#1B3A8C] focus-visible:bg-white focus-visible:shadow-[0_0_0_4px_rgba(27,58,140,0.1)] focus-visible:ring-[#1B3A8C]/20",
                        errors.lastName &&
                          "border-red-400 bg-red-50 focus-visible:border-red-400 focus-visible:shadow-[0_0_0_4px_rgba(248,113,113,0.1)] focus-visible:ring-red-400/15",
                      )}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-xs font-medium text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <FieldLabel htmlFor="email" className="text-sm font-semibold text-slate-500">
                    Email Address
                  </FieldLabel>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      disabled
                      placeholder="Enter your email"
                      className="h-12 cursor-not-allowed rounded-xl border-gray-200/50 bg-gray-100/50 pl-10 text-sm text-gray-400"
                    />
                  </div>
                </div>
              )}
            />

            <Controller
              name="contactNumber"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <FieldLabel htmlFor="contactNumber" className="text-sm font-semibold">
                    Contact Number
                  </FieldLabel>
                  <PhoneInputComponent
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    onBlur={field.onBlur}
                    error={!!errors.contactNumber}
                  />
                  {errors.contactNumber && (
                    <p className="text-xs font-medium text-red-500">
                      {errors.contactNumber.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              type="submit"
              disabled={!isDirty || isSubmitting}
              isLoading={isSubmitting}
              className="h-14 w-full rounded-xl text-base font-bold shadow-sm transition-all sm:w-auto sm:px-10"
            >
              <Check className="mr-2 h-5 w-5" />
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
