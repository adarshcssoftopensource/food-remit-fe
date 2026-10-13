"use client";

import { useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3";
import Image from "next/image";
import { CheckCircle2, Lock, ShieldAlert, KeyRound, LogOut } from "lucide-react";

import { APP_ASSETS } from "@/config/assets";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { successToast } from "@/components/toaster";
import { useChangePassword } from "@/feature/private/(shared)/profile/hooks/use-change-password";
import { useLogout } from "@/hooks/use-logout";

const firstLoginPasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current temporary password is required"),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirmation do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: "New password must be different from your temporary password",
    path: ["newPassword"],
  });

type FirstLoginFormValues = z.infer<typeof firstLoginPasswordSchema>;

const requirements = [
  { label: "Minimum 8 characters", test: (v: string) => v.length >= 8 },
  { label: "At least one uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "At least one number", test: (v: string) => /[0-9]/.test(v) },
];

interface ChangePasswordRequiredScreenProps {
  onSuccess: () => void;
}

export function ChangePasswordRequiredScreen({ onSuccess }: ChangePasswordRequiredScreenProps) {
  const { mutateAsync: changePasswordMutation, isPending } = useChangePassword();
  const { handleLogout, isPending: isLoggingOut } = useLogout();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FirstLoginFormValues>({
    resolver: zodResolver(firstLoginPasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const newPasswordValue = useWatch({
    control,
    name: "newPassword",
    defaultValue: "",
  });

  const metCount = requirements.filter((r) => r.test(newPasswordValue)).length;
  const strengthPercent = (metCount / requirements.length) * 100;
  const strengthColor =
    metCount === 0
      ? "bg-slate-200"
      : metCount === 1
        ? "bg-red-500"
        : metCount === 2
          ? "bg-amber-500"
          : "bg-emerald-500";

  const onSubmit = async (data: FirstLoginFormValues) => {
    setSubmitError(null);
    try {
      await changePasswordMutation({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      successToast({
        title: "Password Set Successfully",
        description: "Your password has been changed. Accessing your store portal...",
      });

      onSuccess();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to change password. Please check your credentials.";
      setSubmitError(message);
    }
  };

  return (
    <div className="brand-mesh-canvas relative flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed -top-40 -left-40 h-125 w-125 rounded-full bg-linear-to-br from-emerald-500/10 to-teal-500/0 blur-3xl" />
      <div className="pointer-events-none fixed -right-40 -bottom-40 h-125 w-125 rounded-full bg-linear-to-tl from-emerald-600/10 to-transparent blur-3xl" />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center">
        {/* Brand Logo */}
        <div className="mb-6 flex flex-col items-center text-center">
          <Image
            src={APP_ASSETS.LOGO.PATH}
            alt={APP_ASSETS.LOGO.ALT}
            width={180}
            height={50}
            priority
            className="h-auto w-auto drop-shadow-sm"
          />
          <div className="mt-3 flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-50/80 px-3 py-1 text-xs font-semibold text-amber-700 backdrop-blur-sm dark:bg-amber-950/40 dark:text-amber-300">
            <KeyRound className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>First-Time Login Security Action</span>
          </div>
        </div>

        {/* Security Card */}
        <Card className="brand-glass-card w-full rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_12px_40px_rgba(14,42,75,0.08)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/95">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-6 py-5 text-center dark:border-slate-800/60 dark:bg-slate-900/40">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100/80 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Lock className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
              Set Your New Password
            </CardTitle>
            <CardDescription className="mx-auto mt-1 max-w-sm text-xs text-slate-500 sm:text-sm dark:text-slate-400">
              For account safety, please replace your temporary credentials with a permanent, secure
              password before accessing your vendor portal.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            {submitError && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-50/90 p-3 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
                <span className="font-medium">{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
              {/* Temporary Password */}
              <Controller
                name="oldPassword"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel
                      htmlFor="temporary-password"
                      className="text-xs font-semibold text-slate-700 dark:text-slate-200"
                    >
                      Temporary / Current Password
                    </FieldLabel>
                    <PasswordInput
                      {...field}
                      id="temporary-password"
                      placeholder="Enter the password provided to you"
                      leftIcon={<KeyRound className="h-4 w-4" />}
                      isInvalid={!!errors.oldPassword}
                      autoComplete="current-password"
                    />
                    {errors.oldPassword && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.oldPassword.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* New Password */}
              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel
                      htmlFor="new-password"
                      className="text-xs font-semibold text-slate-700 dark:text-slate-200"
                    >
                      New Password
                    </FieldLabel>
                    <PasswordInput
                      {...field}
                      id="new-password"
                      placeholder="Create a strong password"
                      leftIcon={<Lock className="h-4 w-4" />}
                      isInvalid={!!errors.newPassword}
                      autoComplete="new-password"
                    />
                    {errors.newPassword && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.newPassword.message}
                      </p>
                    )}

                    {/* Password Strength Indicator */}
                    {newPasswordValue.length > 0 && (
                      <div className="mt-2 space-y-2">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className={`h-full transition-all duration-300 ${strengthColor}`}
                            style={{ width: `${strengthPercent}%` }}
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-1 pt-1">
                          {requirements.map((req) => {
                            const isMet = req.test(newPasswordValue);
                            return (
                              <div
                                key={req.label}
                                className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${
                                  isMet
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-slate-400 dark:text-slate-500"
                                }`}
                              >
                                <CheckCircle2
                                  className={`h-3 w-3 shrink-0 ${
                                    isMet
                                      ? "text-emerald-500"
                                      : "text-slate-300 dark:text-slate-600"
                                  }`}
                                />
                                {req.label}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              />

              {/* Confirm New Password */}
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel
                      htmlFor="confirm-password"
                      className="text-xs font-semibold text-slate-700 dark:text-slate-200"
                    >
                      Confirm New Password
                    </FieldLabel>
                    <PasswordInput
                      {...field}
                      id="confirm-password"
                      placeholder="Re-enter your new password"
                      leftIcon={<Lock className="h-4 w-4" />}
                      isInvalid={!!errors.confirmPassword}
                      autoComplete="new-password"
                    />
                    {errors.confirmPassword && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Button
                id="submit-new-password-btn"
                type="submit"
                isLoading={isPending}
                className="mt-2 h-12 w-full rounded-xl bg-emerald-600 font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-[0.99] dark:bg-emerald-600 dark:hover:bg-emerald-700"
              >
                Set New Password & Enter Portal
              </Button>
            </form>

            {/* Logout Option */}
            <div className="mt-6 border-t border-slate-100 pt-4 text-center dark:border-slate-800">
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleLogout()}
                isLoading={isLoggingOut}
                className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <LogOut className="mr-1.5 h-3.5 w-3.5" />
                Sign out and return to login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
