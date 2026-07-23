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
import { useApiMutation } from "@/hooks/useApi";
import { AUTH_ENDPOINTS, AuthTokenResponse } from "@/lib/api/endpoints/auth.endpoints";
import { successToast } from "@/components/toaster";

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const [submittedEmail, setSubmittedEmail] = useState("");

  const { mutateAsync, isPending, isSuccess, reset } = useApiMutation<
    AuthTokenResponse,
    ForgotPasswordFormValues
  >("post", AUTH_ENDPOINTS.FORGOT_PASSWORD);

  const {
    control,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    try {
      await mutateAsync({ email: data?.email });
      setSubmittedEmail(data.email);
      successToast({
        title: "",
        description: "Password reset instructions have been sent to your email address.",
      });
    } catch {}
  }

  return (
    <div
      className={cn(
        "relative z-10 mx-auto w-full overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-2xl shadow-black/5 sm:p-12",
        className,
      )}
      {...props}
    >
      <div>
        {!isSuccess ? (
          <>
            <div className="mb-10 text-center">
              <div className="from-primary/10 to-primary/20 ring-primary/20 mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br shadow-inner ring-1">
                <Mail className="size-7 text-[#1B3A8C]" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#131b4d]">
                Forgot Password?
              </h1>
              <p className="mx-auto mt-3 max-w-70 text-[15px] leading-relaxed font-medium text-gray-500/90">
                No worries! Enter your email and we&apos;ll send you reset instructions.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="flex flex-col gap-6">
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

                <Button
                  type="submit"
                  isLoading={isPending}
                  className="mt-4 h-14 w-full rounded-xl bg-gradient-to-b from-[#1B3A8C] to-[#131b4d] text-base font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
                >
                  Send Reset Link
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="py-6 text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-green-400/10 to-green-500/20 shadow-inner ring-1 ring-green-500/20">
              <CheckCircle2 className="size-10 text-green-600" />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
              Check your inbox!
            </h2>
            <p className="mx-auto max-w-[280px] text-[15px] leading-relaxed font-medium text-gray-500/90">
              We&apos;ve sent password reset instructions to{" "}
              <span className="font-semibold text-gray-900 dark:text-white">{submittedEmail}</span>
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <Button
                type="button"
                onClick={() => {
                  reset();
                  resetForm({
                    email: submittedEmail,
                  });
                }}
                className="h-12 w-full rounded-xl text-[15px] font-semibold"
              >
                Resend Email
              </Button>
            </div>
          </div>
        )}

        <OrDivider />

        <Link href={ROUTES.AUTH.LOGIN} id="back-to-login-link" className="group mt-4 block">
          <Button
            type="button"
            className="h-12 w-full rounded-xl text-[15px] font-semibold transition-all duration-300 group-hover:bg-gray-100"
            variant={"secondary"}
          >
            <ArrowLeft className="mr-2 size-4 transition-transform duration-200 group-hover:-translate-x-1" />
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
