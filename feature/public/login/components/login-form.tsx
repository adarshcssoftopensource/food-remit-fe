"use client";

import { Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { ROUTES } from "@/config/routes";
import { useApiMutation } from "@/hooks/useApi";
import { AUTH_ENDPOINTS, AuthTokenResponse } from "@/lib/api/endpoints/auth.endpoints";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useSuccessfulLogin } from "../hooks/use-successful-login";
import { LoginFormValues, loginSchema } from "../schema/login.schema";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { handleSuccessfulLogin } = useSuccessfulLogin();

  const { mutateAsync, isPending } = useApiMutation<AuthTokenResponse, LoginFormValues>(
    "post",
    AUTH_ENDPOINTS.LOGIN,
  );

  const { mutateAsync: forceLogoutMutation, isPending: isForceLoggingOut } = useApiMutation<
    any,
    { userId: string }
  >("post", AUTH_ENDPOINTS.FORCE_LOGOUT);

  const [forceLogoutUserId, setForceLogoutUserId] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  async function onSubmit(data: LoginFormValues) {
    try {
      const res = await mutateAsync(data);
      if (res?.access_token) {
        await handleSuccessfulLogin(res.access_token, "You have been logged in successfully.");
      }
    } catch (error: any) {
      if (
        error?.response?.data?.errorCode === "MAX_SESSIONS_REACHED" &&
        error?.response?.data?.userId
      ) {
        setForceLogoutUserId(error.response.data.userId);
      }
    }
  }

  async function handleForceLogout() {
    if (!forceLogoutUserId) return;
    try {
      await forceLogoutMutation({ userId: forceLogoutUserId });
      setForceLogoutUserId(null);

      const formData = getValues();
      const res = await mutateAsync(formData);

      if (res?.access_token) {
        await handleSuccessfulLogin(
          res.access_token,
          "All other sessions logged out. You are now logged in.",
        );
      }
    } catch (error) {
      // ignore
    }
  }

  return (
    <div
      className={cn(
        "brand-glass-card relative z-10 w-full overflow-hidden rounded-3xl border border-white/80 p-8 shadow-2xl backdrop-blur-2xl sm:p-10 dark:border-slate-800/80",
        className,
      )}
      {...props}
    >
      <div>
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500/15 to-teal-500/20 shadow-inner ring-1 ring-emerald-500/30">
            <User className="size-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            Sign in to access your Food Remit executive portal
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate suppressHydrationWarning>
          <div className="flex flex-col gap-2">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <FieldLabel htmlFor="email" className="text-sm font-semibold">
                    Email Address
                  </FieldLabel>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      className={cn(
                        "h-12 rounded-xl border-gray-200/80 bg-gray-50/50 pl-10 text-sm transition-colors duration-300 placeholder:text-gray-400/80",
                        "hover:border-gray-300 hover:bg-gray-50",
                        "focus-visible:border-[#1B3A8C] focus-visible:bg-white focus-visible:shadow-[0_0_0_4px_rgba(27,58,140,0.1)] focus-visible:ring-[#1B3A8C]/20",
                        errors.email &&
                          "border-red-400 bg-red-50 focus-visible:border-red-400 focus-visible:shadow-[0_0_0_4px_rgba(248,113,113,0.1)] focus-visible:ring-red-400/15",
                      )}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs font-medium text-red-500">{errors.email.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <div className="mt-1 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="login-password" className="text-sm font-semibold">
                      Password
                    </FieldLabel>
                  </div>
                  <PasswordInput
                    {...field}
                    placeholder="Enter your password"
                    isInvalid={!!errors.password}
                    leftIcon={<Lock className="size-4" />}
                  />
                  {errors.password && (
                    <p className="text-xs font-medium text-red-500">{errors.password.message}</p>
                  )}
                </div>
              )}
            />
            <div className="flex items-center justify-end" suppressHydrationWarning>
              <Link
                href={ROUTES.AUTH.FORGOT_PASSWORD}
                id="forgot-password-link"
                className="hover: text-sm font-bold hover:underline hover:underline-offset-2"
              >
                Forgot password?
              </Link>
            </div>
            <Button
              type="submit"
              isLoading={isPending}
              className="mt-4 h-14 w-full rounded-xl text-base font-bold shadow-sm transition-colors"
            >
              Sign In
            </Button>
          </div>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-gray-400">
        © 2026 Food Remit. All rights reserved.
      </p>

      <ConfirmationDialog
        open={!!forceLogoutUserId}
        onOpenChange={(open) => !open && setForceLogoutUserId(null)}
        title="Maximum Logins Reached"
        description="You have reached the maximum number of active sessions (5). Do you want to force logout all other devices and continue here?"
        confirmLabel="Force Logout"
        cancelLabel="Cancel"
        onConfirm={handleForceLogout}
        onCancel={() => setForceLogoutUserId(null)}
        isLoading={isForceLoggingOut}
        variant="destructive"
      />
    </div>
  );
}
