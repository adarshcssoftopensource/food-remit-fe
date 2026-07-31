"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Mail, Phone, User } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { profileDetailsSchema, type ProfileDetailsValues } from "../schema/profile.schema";

export function ProfileForm() {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileDetailsValues>({
    resolver: zodResolver(profileDetailsSchema),
    defaultValues: {
      firstName: "Admin",
      lastName: "User",
      email: "admin@foodremit.com",
      contactNumber: "+1 (555) 123-4567",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: ProfileDetailsValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Profile update:", data);
  };

  return (
    <Card className="rounded-[2rem] border-0 shadow-2xl ring-1 shadow-black/5 ring-slate-200">
      <CardHeader className="border-b bg-slate-50/50 px-8 py-6">
        <CardTitle className="text-xl font-bold tracking-tight text-slate-800">
          Personal Information
        </CardTitle>
        <CardDescription className="text-sm font-medium text-slate-500">
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
                    <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      {...field}
                      id="firstName"
                      placeholder="Enter your first name"
                      aria-invalid={!!errors.firstName}
                      className={cn(
                        "h-12 rounded-xl border-gray-200/80 bg-gray-50/50 pl-10 text-sm transition-all duration-300 placeholder:text-gray-400/80",
                        "hover:border-gray-300 hover:bg-gray-50",
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
                    <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      {...field}
                      id="lastName"
                      placeholder="Enter your last name"
                      aria-invalid={!!errors.lastName}
                      className={cn(
                        "h-12 rounded-xl border-gray-200/80 bg-gray-50/50 pl-10 text-sm transition-all duration-300 placeholder:text-gray-400/80",
                        "hover:border-gray-300 hover:bg-gray-50",
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
              name="contactNumber"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <FieldLabel htmlFor="contactNumber" className="text-sm font-semibold">
                    Contact Number
                  </FieldLabel>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      {...field}
                      id="contactNumber"
                      placeholder="Enter your contact number"
                      aria-invalid={!!errors.contactNumber}
                      className={cn(
                        "h-12 rounded-xl border-gray-200/80 bg-gray-50/50 pl-10 text-sm transition-all duration-300 placeholder:text-gray-400/80",
                        "hover:border-gray-300 hover:bg-gray-50",
                        "focus-visible:border-[#1B3A8C] focus-visible:bg-white focus-visible:shadow-[0_0_0_4px_rgba(27,58,140,0.1)] focus-visible:ring-[#1B3A8C]/20",
                        errors.contactNumber &&
                          "border-red-400 bg-red-50 focus-visible:border-red-400 focus-visible:shadow-[0_0_0_4px_rgba(248,113,113,0.1)] focus-visible:ring-red-400/15",
                      )}
                    />
                  </div>
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
