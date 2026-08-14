"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Globe2, Home, Mail, UserRound } from "lucide-react";
import Image from "next/image";
import { Controller, useForm, useWatch } from "react-hook-form";

import { ImageUpload } from "@/components/common/image-upload";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PhoneInputComponent } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Country, State, City } from "country-state-city";
import { useGetCountriesDropdown } from "@/feature/private/settings/hooks/use-get-countries-dropdown";
import {
  countryManagerSchema,
  type CountryManagerFormValues,
} from "../schema/country-manager.schema";
import { cn } from "@/lib/utils";

type CountryManagerFormProps = {
  initialValues?: Partial<CountryManagerFormValues>;
  previewImageUrl?: string;
  onSubmit: (values: CountryManagerFormValues) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  mode?: "add" | "edit";
};

function SectionShell({
  icon: Icon,
  title,
  subtitle,
  accent,
  children,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  accent: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04)]",
        className,
      )}
    >
      <div className="flex items-start gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-4">
        <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", accent)}>
          <Icon className="size-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold tracking-tight text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-4 p-5">{children}</div>
    </section>
  );
}

export function CountryManagerForm({
  initialValues,
  previewImageUrl,
  onSubmit,
  submitLabel = "Assign Manager",
  isSubmitting = false,
  mode = "add",
}: CountryManagerFormProps) {
  const {
    control,
    handleSubmit,
    setValue,
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

  const allWorldCountries = Country.getAllCountries();

  const selectedCountryObj = allWorldCountries.find((c) => c.name === residentialCountry);
  const stateOptions = selectedCountryObj
    ? State.getStatesOfCountry(selectedCountryObj.isoCode)
    : [];

  const selectedStateObj = stateOptions.find((s) => s.name === state);
  const cityOptions =
    selectedCountryObj && selectedStateObj
      ? City.getCitiesOfState(selectedCountryObj.isoCode, selectedStateObj.isoCode)
      : [];

  const { countries: countriesData } = useGetCountriesDropdown();

  const fieldError = (message?: string) =>
    message ? <p className="mt-1 text-xs font-medium text-red-500">{message}</p> : null;

  const inputClass =
    "h-11 rounded-xl border-slate-200 bg-slate-50/80 transition focus-visible:bg-white";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-5 overflow-y-auto bg-slate-50/30 p-6">
        <SectionShell
          icon={UserRound}
          title="Profile Photo"
          subtitle="Upload a clear headshot for the country manager profile"
          accent="bg-primary/10 text-primary"
        >
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="min-w-0 flex-1">
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    multiple={false}
                    maxFiles={1}
                    label={mode === "edit" ? "Replace photo" : "Upload manager photo"}
                    hint="PNG, JPG or WEBP · max 1 image"
                    initialImages={previewImageUrl ? [previewImageUrl] : []}
                  />
                  {fieldError(errors.image?.message as string | undefined)}
                </div>
              </div>
            )}
          />
        </SectionShell>

        <div className="grid gap-5 lg:grid-cols-2">
          <SectionShell
            icon={UserRound}
            title="Personal Details"
            subtitle="Basic identity & contact"
            accent="bg-sky-100 text-sky-700"
          >
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <FieldLabel className="mb-1.5 text-sm font-semibold">
                        First Name <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input {...field} placeholder="Enter first name" className={inputClass} />
                      {fieldError(errors.firstName?.message)}
                    </div>
                  )}
                />
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <FieldLabel className="mb-1.5 text-sm font-semibold">
                        Last Name <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input {...field} placeholder="Enter last name" className={inputClass} />
                      {fieldError(errors.lastName?.message)}
                    </div>
                  )}
                />
              </div>

              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <div>
                    <FieldLabel className="mb-1.5 text-sm font-semibold">
                      Email Address <span className="text-red-500">*</span>
                    </FieldLabel>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        {...field}
                        type="email"
                        placeholder="name@example.com"
                        disabled={mode === "edit"}
                        className={cn(inputClass, "pl-10")}
                      />
                    </div>
                    {fieldError(errors.email?.message)}
                  </div>
                )}
              />

              <div>
                <FieldLabel className="mb-1.5 text-sm font-semibold">
                  Phone Number <span className="text-red-500">*</span>
                </FieldLabel>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field: numberField }) => (
                    <Controller
                      name="phoneCode"
                      control={control}
                      render={({ field: codeField }) => (
                        <PhoneInputComponent
                          disabled={mode === "edit"}
                          value={(codeField.value || "") + (numberField.value || "")}
                          onChange={(val, data) => {
                            if (data && data.dialCode) {
                              const dialCode = data.dialCode;
                              let nationalNumber = val;
                              if (val.startsWith(dialCode)) {
                                nationalNumber = val.slice(dialCode.length);
                              }
                              setValue("phoneCode", "+" + dialCode, { shouldValidate: true });
                              setValue("phoneNumber", nationalNumber, { shouldValidate: true });
                            } else {
                              setValue("phoneNumber", val, { shouldValidate: true });
                            }
                          }}
                          onBlur={numberField.onBlur}
                          error={!!(errors.phoneCode || errors.phoneNumber)}
                        />
                      )}
                    />
                  )}
                />
                {fieldError(errors.phoneCode?.message || errors.phoneNumber?.message)}
              </div>
            </div>
          </SectionShell>

          <SectionShell
            icon={Home}
            title="Residential Address"
            subtitle="Where this manager lives"
            accent="bg-emerald-100 text-emerald-700"
          >
            <div className="grid gap-4">
              <Controller
                name="address1"
                control={control}
                render={({ field }) => (
                  <div>
                    <FieldLabel className="mb-1.5 text-sm font-semibold">
                      Address 1 <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input {...field} placeholder="Street address" className={inputClass} />
                    {fieldError(errors.address1?.message)}
                  </div>
                )}
              />
              <Controller
                name="address2"
                control={control}
                render={({ field }) => (
                  <div>
                    <FieldLabel className="mb-1.5 text-sm font-semibold">Address 2</FieldLabel>
                    <Input
                      {...field}
                      placeholder="Street address 2 (optional)"
                      className={inputClass}
                    />
                    {fieldError(errors.address2?.message)}
                  </div>
                )}
              />
              <Controller
                name="residentialCountry"
                control={control}
                render={({ field }) => (
                  <div>
                    <FieldLabel className="mb-1.5 text-sm font-semibold">
                      Residential Country <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={(v) => {
                        field.onChange(v ?? "");
                        setValue("state", "");
                        setValue("city", "");
                      }}
                    >
                      <SelectTrigger className={inputClass}>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {allWorldCountries.map((c) => (
                          <SelectItem key={c.isoCode} value={c.name}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldError(errors.residentialCountry?.message)}
                  </div>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <FieldLabel className="mb-1.5 text-sm font-semibold">
                        State <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={(v) => {
                          field.onChange(v ?? "");
                          setValue("city", "");
                        }}
                        disabled={!residentialCountry}
                      >
                        <SelectTrigger className={inputClass}>
                          <SelectValue
                            placeholder={
                              residentialCountry ? "Select state" : "Select country first"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {stateOptions.map((opt) => (
                            <SelectItem key={opt.isoCode} value={opt.name}>
                              {opt.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldError(errors.state?.message)}
                    </div>
                  )}
                />
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <FieldLabel className="mb-1.5 text-sm font-semibold">
                        City <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Select value={field.value} onValueChange={field.onChange} disabled={!state}>
                        <SelectTrigger className={inputClass}>
                          <SelectValue placeholder={state ? "Select city" : "Select state first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {cityOptions.map((opt) => (
                            <SelectItem key={opt.name} value={opt.name}>
                              {opt.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldError(errors.city?.message)}
                    </div>
                  )}
                />
              </div>
              <Controller
                name="zipcode"
                control={control}
                render={({ field }) => (
                  <div>
                    <FieldLabel className="mb-1.5 text-sm font-semibold">Zipcode</FieldLabel>
                    <Input {...field} placeholder="Enter zipcode" className={inputClass} />
                    {fieldError(errors.zipcode?.message)}
                  </div>
                )}
              />
            </div>
          </SectionShell>
        </div>

        <SectionShell
          icon={Globe2}
          title="Assignment"
          subtitle="Country this manager will handle"
          accent="bg-amber-100 text-amber-700"
        >
          <Controller
            name="assignedCountry"
            control={control}
            render={({ field }) => (
              <div className="max-w-md">
                <FieldLabel className="mb-1.5 text-sm font-semibold">
                  Assign Country <span className="text-red-500">*</span>
                </FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className={inputClass}>
                    <SelectValue placeholder="Select country to assign">
                      {countriesData.find((c) => c.id === field.value)?.name ||
                        "Select country to assign"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {countriesData.map((country) => (
                      <SelectItem key={country.id} value={country.id}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldError(errors.assignedCountry?.message)}
              </div>
            )}
          />
        </SectionShell>
      </div>

      <div className="sticky bottom-0 z-10 flex justify-center border-t bg-white px-6 py-4 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="h-12 rounded-xl px-12 text-base font-semibold shadow-md transition-all hover:scale-[1.02]"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
