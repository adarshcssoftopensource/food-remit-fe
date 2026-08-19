"use client";

import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";

import { PasswordStrengthIndicator } from "@/components/common/password-strength-indicator";
import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import OrDivider from "@/components/ui/or-divider";
import { PasswordInput } from "@/components/ui/password-input";
import { ROUTES } from "@/config/routes";
import { useApiMutation } from "@/hooks/useApi";
import { AUTH_ENDPOINTS, AuthTokenResponse } from "@/lib/api/endpoints/auth.endpoints";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { ChangePasswordFormValues, changePasswordSchema } from "../schema/change-password.schema";

type ResetPasswordPayload = {
  token: string;
  newPassword: string;
};

export function ChangePasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const [token] = useQueryState("token");

  const { mutateAsync, isPending } = useApiMutation<AuthTokenResponse, ResetPasswordPayload>(
    "post",
    AUTH_ENDPOINTS.RESET_PASSWORD,
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: ChangePasswordFormValues) {
    try {
      await mutateAsync({
        token: token ?? "",
        newPassword: data.newPassword,
      });
      router.refresh();
      router.push(ROUTES.AUTH.LOGIN);
      successToast({
        description: "Your password has been changed successfully. ",
      });
    } catch {}
  }

  return (
    <div
      className={cn(
        "relative z-10 w-full overflow-hidden rounded-[2.5rem] p-8 shadow-2xl shadow-black/40 sm:p-12",
        className,
      )}
      {...props}
    >
      <div>
        <>
          <div className="mb-4 text-center">
            <div className="from-primary/10 to-primary/20 ring-primary/20 mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br shadow-inner ring-1">
              <Lock className="size-7" />
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight">Change Password</h1>

            <p className="mx-auto mt-3 max-w-70 text-[15px] leading-relaxed font-medium text-gray-500/90">
              Create a strong new password to keep your account secure.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-6">
              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel htmlFor="new-password" className="text-sm font-semibold">
                      New Password
                    </FieldLabel>

                    <PasswordInput
                      {...field}
                      id="new-password"
                      placeholder="Enter your new password"
                      isInvalid={!!errors.newPassword}
                      leftIcon={<Lock className="size-4" />}
                    />

                    {errors.newPassword && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.newPassword.message}
                      </p>
                    )}
                    <PasswordStrengthIndicator password={field.value ?? ""} />
                  </div>
                )}
              />

              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel htmlFor="confirm-password" className="text-sm font-semibold">
                      Confirm Password
                    </FieldLabel>

                    <PasswordInput
                      {...field}
                      id="confirm-password"
                      placeholder="Confirm your new password"
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

              <Button
                type="submit"
                isLoading={isPending}
                className="mt-4 h-14 w-full rounded-xl text-base font-bold"
              >
                Update Password
              </Button>
            </div>
          </form>
        </>

        <OrDivider />

        <Link href={ROUTES.AUTH.LOGIN} className="group mt-4 block">
          <Button
            variant="secondary"
            className="h-12 w-full rounded-xl text-[15px] font-semibold transition-colors duration-300 group-hover:bg-gray-100"
          >
            <ArrowLeft className="mr-2 size-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Back to Sign In
          </Button>
        </Link>
      </div>

      <p className="mt-6 text-center text-xs text-gray-400">
        © 2026 Food Remit. All rights reserved.
      </p>
    </div>
  );
}
