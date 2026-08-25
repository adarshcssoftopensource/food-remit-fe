"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Lock, ShieldCheck } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { useChangePassword } from "../hooks/use-change-password";
import { PasswordFormValues, passwordSchema } from "../schema/password.schema";

const requirements = [
  { label: "Minimum 8 characters", test: (v: string) => v.length >= 8 },
  { label: "At least one uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "At least one number", test: (v: string) => /[0-9]/.test(v) },
];

export function ChangePassword() {
  const { mutateAsync: changePasswordMutation, isPending } = useChangePassword();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
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

  const onSubmit = async (data: PasswordFormValues) => {
    try {
      await changePasswordMutation({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      reset();
      successToast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
    } catch {
      // Error handling is managed by API interceptor
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Security tips banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4">
        <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
        <div>
          <p className="text-sm font-bold text-emerald-700">Keep your account safe</p>
          <p className="mt-0.5 text-xs font-medium text-emerald-700/80">
            Use a unique password that you don&apos;t use for other websites.
          </p>
        </div>
      </div>

      <Card className="brand-glass-card rounded-3xl border border-white/60 shadow-[0_8px_30px_rgba(14,42,75,0.04)] backdrop-blur-xl dark:border-slate-800/60">
        <CardHeader className="border-b border-slate-200/60 bg-slate-50/50 px-8 py-6 dark:border-slate-800/60 dark:bg-slate-900/40">
          <CardTitle className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Change Password
          </CardTitle>
          <CardDescription className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Update your security credentials and ensure account safety.
          </CardDescription>
        </CardHeader>

        <CardContent className="max-w-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Controller
              name="oldPassword"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <FieldLabel htmlFor="oldPassword" className="text-sm font-semibold">
                    Old Password <span className="text-red-500">*</span>
                  </FieldLabel>
                  <PasswordInput
                    {...field}
                    placeholder="Enter your old password"
                    isInvalid={!!errors.oldPassword}
                    leftIcon={<Lock className="size-4" />}
                  />
                  {errors.oldPassword && (
                    <p className="text-xs font-medium text-red-500">{errors.oldPassword.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <FieldLabel htmlFor="newPassword" className="text-sm font-semibold">
                    New Password <span className="text-red-500">*</span>
                  </FieldLabel>
                  <PasswordInput
                    {...field}
                    placeholder="Create a strong password"
                    isInvalid={!!errors.newPassword}
                    leftIcon={<Lock className="size-4" />}
                  />
                  {errors.newPassword && (
                    <p className="text-xs font-medium text-red-500">{errors.newPassword.message}</p>
                  )}

                  {/* Strength bar */}
                  {newPasswordValue.length > 0 && (
                    <div className="mt-1 space-y-2">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${strengthColor}`}
                          style={{ width: `${strengthPercent}%` }}
                        />
                      </div>
                      <ul className="space-y-1">
                        {requirements.map((req) => {
                          const met = req.test(newPasswordValue);
                          return (
                            <li key={req.label} className="flex items-center gap-2">
                              <CheckCircle2
                                className={`h-3.5 w-3.5 shrink-0 transition-colors ${met ? "text-emerald-500" : "text-slate-300"}`}
                              />
                              <span
                                className={`text-xs transition-colors ${met ? "text-emerald-700" : "text-slate-400"}`}
                              >
                                {req.label}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <FieldLabel htmlFor="confirmPassword" className="text-sm font-semibold">
                    Confirm New Password <span className="text-red-500">*</span>
                  </FieldLabel>
                  <PasswordInput
                    {...field}
                    placeholder="Re-enter your new password"
                    isInvalid={!!errors.confirmPassword}
                    leftIcon={<Lock className="size-4" />}
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs font-medium text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              )}
            />

            <div className="mt-8 flex justify-end">
              <Button
                type="submit"
                disabled={isPending}
                isLoading={isPending}
                className="h-14 w-full rounded-xl text-base font-bold shadow-sm transition-colors sm:w-auto sm:px-10"
              >
                <ShieldCheck className="mr-2 h-5 w-5" />
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
