"use client";

import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { Lock, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import OrDivider from "@/components/ui/or-divider";
import { cn } from "@/lib/utils";
import { PasswordInput } from "@/components/ui/password-input";
import { ChangePasswordFormValues, changePasswordSchema } from "../schema/change-password.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/config/routes";

export function ChangePasswordForm({ className, ...props }: React.ComponentProps<"div">) {
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
    console.log(data);
  }

  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="px-8 py-10">
        <>
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EBF0FF]">
              <Lock size={22} />
            </div>

            <h1 className="text-[1.75rem] font-bold tracking-tight">Change Password</h1>

            <p className="mx-auto mt-2 max-w-80 text-sm leading-relaxed text-gray-500">
              Create a strong new password to keep your account secure.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-5">
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

              <Button type="submit" className="h-11 rounded-xl">
                Update Password
              </Button>
            </div>
          </form>
        </>

        <OrDivider />

        <Link href={ROUTES.AUTH.LOGIN}>
          <Button variant="secondary" className="w-full">
            <ArrowLeft className="size-4" />
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
