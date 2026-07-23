"use client";

import { useState } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ForgotPasswordFormValues, forgotPasswordSchema } from "../schema/forgot-password.schema";
import { Button } from "@/components/ui/button";
import OrDivider from "@/components/ui/or-divider";
import { FieldLabel } from "@/components/ui/field";
import { ROUTES } from "@/config/routes";

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    setIsLoading(true);
    // TODO: Wire up password reset API call
    console.log(data);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmittedEmail(data.email);
    setIsLoading(false);
    setIsSuccess(true);
  }

  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="px-8 py-10">
        {!isSuccess ? (
          <>
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EBF0FF]">
                <Mail className="size-6 text-[#1B3A8C]" />
              </div>
              <h1 className="text-[1.75rem] leading-tight font-bold tracking-tight">
                Forgot Password?
              </h1>
              <p className="mx-auto mt-1.5 max-w-75 text-sm leading-relaxed text-gray-500">
                No worries! Enter your email and we&apos;ll send you reset instructions.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="flex flex-col gap-5">
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1.5">
                      <FieldLabel htmlFor="reset-email" className="text-sm font-semibold">
                        Email Address
                      </FieldLabel>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          {...field}
                          id="reset-email"
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

                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full rounded-xl text-sm font-semibold"
                >
                  Send Reset Link
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="py-4 text-center">
            <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8F5E9]">
              <CheckCircle2 className="size-8 text-[#2E7D32]" />
            </div>
            <h2 className="mb-2 text-xl font-bold">Check your inbox!</h2>
            <p className="mx-auto max-w-72.5 text-sm leading-relaxed text-gray-500">
              We&apos;ve sent password reset instructions to{" "}
              <span className="font-semibold">{submittedEmail}</span>
            </p>

            <div className="mt-5 flex flex-col gap-3">
              <Button type="button" onClick={() => setIsSuccess(false)}>
                Resend Email
              </Button>
            </div>
          </div>
        )}

        <OrDivider />

        <Link href={ROUTES.AUTH.LOGIN} id="back-to-login-link">
          <Button type="button" className="w-full" variant={"secondary"}>
            <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back to Sign In
          </Button>
        </Link>
      </div>

      <p className="mt-6 text-center text-xs text-gray-400">
        © 2024 Food Remit. All rights reserved.
      </p>
    </div>
  );
}
