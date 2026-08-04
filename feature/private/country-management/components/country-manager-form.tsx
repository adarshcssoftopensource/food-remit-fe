"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";

import { ImageUpload } from "@/components/common/image-upload";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  COUNTRY_MANAGER_CITY_OPTIONS,
  COUNTRY_MANAGER_COUNTRY_OPTIONS,
  COUNTRY_MANAGER_PHONE_CODES,
  COUNTRY_MANAGER_STATE_OPTIONS,
} from "@/constants/country-manager";
import Image from "next/image";
import {
  countryManagerSchema,
  type CountryManagerFormValues,
} from "../schema/country-manager.schema";

type CountryManagerFormProps = {
  initialValues?: Partial<CountryManagerFormValues>;
  previewImageUrl?: string;
  onSubmit: (values: CountryManagerFormValues) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
};

export function CountryManagerForm({
  initialValues,
  previewImageUrl,
  onSubmit,
  submitLabel = "Assign",
  isSubmitting = false,
}: CountryManagerFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CountryManagerFormValues>({
    resolver: zodResolver(countryManagerSchema),
    defaultValues: {
      image: initialValues?.image ?? [],
      firstName: initialValues?.firstName ?? "",
      lastName: initialValues?.lastName ?? "",
      email: initialValues?.email ?? "",
      phoneCode: initialValues?.phoneCode ?? "",
      phoneNumber: initialValues?.phoneNumber ?? "",
      address1: initialValues?.address1 ?? "",
      address2: initialValues?.address2 ?? "",
      residentialCountry: initialValues?.residentialCountry ?? "",
      state: initialValues?.state ?? "",
      city: initialValues?.city ?? "",
      zipcode: initialValues?.zipcode ?? "",
      assignedCountry: initialValues?.assignedCountry ?? "",
    },
    mode: "onChange",
  });

  const residentialCountry = useWatch({ control, name: "residentialCountry" });
  const state = useWatch({ control, name: "state" });

  const stateOptions = residentialCountry
    ? COUNTRY_MANAGER_STATE_OPTIONS[residentialCountry] || []
    : [];
  const cityOptions = state ? COUNTRY_MANAGER_CITY_OPTIONS[state] || [] : [];

  const fieldError = (message?: string) =>
    message ? <p className="text-xs font-medium text-red-500">{message}</p> : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <Controller
          name="image"
          control={control}
          render={({ field }) => (
            <div className="space-y-1.5">
              <FieldLabel className="text-sm font-semibold">
                Image <span className="text-red-500">*</span>
              </FieldLabel>
              {previewImageUrl ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
                  <Image
                    src={previewImageUrl}
                    alt="Current manager"
                    className="h-16 w-16 rounded-lg border object-cover"
                  />
                </div>
              ) : null}
              <ImageUpload
                value={field.value}
                onChange={field.onChange}
                multiple={false}
                maxFiles={1}
                label="Upload manager photo"
                hint="PNG, JPG or WEBP - 1 image"
              />
              {fieldError(errors.image?.message as string | undefined)}
            </div>
          )}
        />

        <Controller
          name="address2"
          control={control}
          render={({ field }) => (
            <div className="space-y-1.5">
              <FieldLabel className="text-sm font-semibold">Address 2</FieldLabel>
              <Input {...field} placeholder="Enter address 2" className="h-11 rounded-xl" />
              {fieldError(errors.address2?.message)}
            </div>
          )}
        />

        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <div className="space-y-1.5">
              <FieldLabel className="text-sm font-semibold">First Name *</FieldLabel>
              <Input {...field} placeholder="Enter first name" className="h-11 rounded-xl" />
              {fieldError(errors.firstName?.message)}
            </div>
          )}
        />

        <Controller
          name="residentialCountry"
          control={control}
          render={({ field }) => (
            <div className="space-y-1.5">
              <FieldLabel className="text-sm font-semibold">Residential Country *</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-11! w-full rounded-xl">
                  <SelectValue placeholder="Please select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_MANAGER_COUNTRY_OPTIONS.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldError(errors.residentialCountry?.message)}
            </div>
          )}
        />

        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <div className="space-y-1.5">
              <FieldLabel className="text-sm font-semibold">Last Name *</FieldLabel>
              <Input {...field} placeholder="Enter last name" className="h-11 rounded-xl" />
              {fieldError(errors.lastName?.message)}
            </div>
          )}
        />

        <Controller
          name="state"
          control={control}
          render={({ field }) => (
            <div className="space-y-1.5">
              <FieldLabel className="text-sm font-semibold">State *</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-11! w-full rounded-xl">
                  <SelectValue placeholder="Please select state" />
                </SelectTrigger>
                <SelectContent>
                  {stateOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldError(errors.state?.message)}
            </div>
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <div className="space-y-1.5">
              <FieldLabel className="text-sm font-semibold">Email Address *</FieldLabel>
              <Input
                {...field}
                type="email"
                placeholder="Enter email address"
                className="h-11 rounded-xl"
              />
              {fieldError(errors.email?.message)}
            </div>
          )}
        />

        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <div className="space-y-1.5">
              <FieldLabel className="text-sm font-semibold">City *</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-11! w-full rounded-xl">
                  <SelectValue placeholder="Please select city" />
                </SelectTrigger>
                <SelectContent>
                  {cityOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldError(errors.city?.message)}
            </div>
          )}
        />

        <div className="space-y-1.5">
          <FieldLabel className="text-sm font-semibold">Phone Number *</FieldLabel>
          <div className="flex gap-2">
            <Controller
              name="phoneCode"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-11! w-40 rounded-xl">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRY_MANAGER_PHONE_CODES.map((code) => (
                      <SelectItem key={code.value} value={code.value}>
                        {code.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter phone number" className="h-11 rounded-xl" />
              )}
            />
          </div>
          {fieldError(errors.phoneCode?.message || errors.phoneNumber?.message)}
        </div>

        <Controller
          name="zipcode"
          control={control}
          render={({ field }) => (
            <div className="space-y-1.5">
              <FieldLabel className="text-sm font-semibold">Zipcode</FieldLabel>
              <Input {...field} placeholder="Enter zipcode" className="h-11 rounded-xl" />
              {fieldError(errors.zipcode?.message)}
            </div>
          )}
        />

        <Controller
          name="address1"
          control={control}
          render={({ field }) => (
            <div className="space-y-1.5">
              <FieldLabel className="text-sm font-semibold">Address 1 *</FieldLabel>
              <Input {...field} placeholder="Enter address 1" className="h-11 rounded-xl" />
              {fieldError(errors.address1?.message)}
            </div>
          )}
        />

        <Controller
          name="assignedCountry"
          control={control}
          render={({ field }) => (
            <div className="space-y-1.5">
              <FieldLabel className="text-sm font-semibold">Assign Country *</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-11! w-full rounded-xl">
                  <SelectValue placeholder="Please select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_MANAGER_COUNTRY_OPTIONS.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldError(errors.assignedCountry?.message)}
            </div>
          )}
        />
      </div>

      <div className="flex justify-center border-t pt-4">
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="h-11 rounded-xl px-10 font-semibold"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
