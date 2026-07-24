"use client";

import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock } from "lucide-react";

import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { cn } from "@/lib/utils";
import { LoginFormValues, loginSchema } from "../schema/login.schema";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import { ROUTES } from "@/config/routes";
import { AUTH_ENDPOINTS, AuthTokenResponse } from "@/lib/api/endpoints/auth.endpoints";
import { useApiMutation } from "@/hooks/useApi";
import { successToast } from "@/components/toaster";
import { setAuthSession } from "@/lib/authClient";
import { useRouter } from "next/navigation";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();

  const { mutateAsync, isPending } = useApiMutation<AuthTokenResponse, LoginFormValues>(
    "post",
    AUTH_ENDPOINTS.LOGIN,
  );

  const {
    control,
    handleSubmit,
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
        setAuthSession({
          accessToken: res.access_token,
          refreshToken: res.refresh_token,
        });
        successToast({
          title: "",
          description: "You have been logged in successfully.",
        });
        router.refresh();
        router.push(ROUTES.ADMIN.DASHBOARD);
      }
    } catch {}
  }

  return (
    <div
      className={cn(
        "relative z-10 w-full overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-2xl shadow-black/40 sm:p-12",
        className,
      )}
      {...props}
    >
      <div>
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome Back</h1>
          <p className="mt-2 text-sm font-medium text-gray-500/80">
            Sign in to your Food Remit account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
                    <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      className={cn(
                        "h-12 rounded-xl border-gray-200/80 bg-gray-50/50 pl-10 text-sm transition-all duration-300 placeholder:text-gray-400/80",
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
            <div className="flex items-center justify-end">
              <Link
                href={ROUTES.AUTH.FORGOT_PASSWORD}
                id="forgot-password-link"
                className="hover: text-sm font-bold text-[#1B3A8C] transition-all hover:underline hover:underline-offset-2"
              >
                Forgot password?
              </Link>
            </div>
            <Button
              type="submit"
              isLoading={isPending}
              className="mt-4 h-14 w-full rounded-xl bg-gradient-to-b from-[#1B3A8C] to-[#131b4d] text-base font-bold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
            >
              Sign In
            </Button>
          </div>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-gray-400">
        © 2024 Food Remit. All rights reserved.
      </p>
    </div>
  );
}
