"use client";

import { useState } from "react";
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

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    // TODO: Wire up auth API call
    console.log(data);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
  }

  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="px-8 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-[1.75rem] leading-tight font-bold tracking-tight">Welcome Back</h1>
          <p className="mt-1.5 text-sm text-gray-500">Sign in to your Food Remit account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-5">
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
                        "h-11 rounded-xl border-gray-200 bg-gray-50 pl-10 transition-all duration-200 placeholder:text-gray-400",
                        "focus-visible:border-[#1B3A8C] focus-visible:bg-white focus-visible:ring-[#1B3A8C]/15",
                        errors.email &&
                          "border-red-400 bg-red-50 focus-visible:border-red-400 focus-visible:ring-red-400/15",
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
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="login-password" className="text-sm font-semibold">
                      Password
                    </FieldLabel>
                    <Link
                      href={ROUTES.AUTH.FORGOT_PASSWORD}
                      id="forgot-password-link"
                      className="text-sm font-semibold text-[#2E7D32] transition-colors hover:text-[#1B5E20]"
                    >
                      Forgot?
                    </Link>
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

            <Button type="submit" isLoading={isLoading}>
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
