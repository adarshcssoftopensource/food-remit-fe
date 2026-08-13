"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Globe2, Home, Mail, MapPin, Phone, UserRound } from "lucide-react";
import Image from "next/image";
import { Controller, useForm, useWatch } from "react-hook-form";

import { ImageUpload } from "@/components/common/image-upload";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useGetCities } from "@/feature/private/settings/hooks/use-get-cities";
import { cn } from "@/lib/utils";
import { cityManagerSchema, type CityManagerFormValues } from "../schema/city-manager.schema";

type CityManagerFormProps = {
  initialValues?: Partial<CityManagerFormValues>;
  previewImageUrl?: string;
  onSubmit: (values: CityManagerFormValues) => void;
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

export function CityManagerForm({
  initialValues,
  previewImageUrl,
  onSubmit,
  submitLabel = "Assign",
  isSubmitting = false,
  mode = "add",
}: CityManagerFormProps) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CityManagerFormValues>({
    resolver: zodResolver(cityManagerSchema),
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
      country: initialValues?.country ?? "",
      assignedCities: initialValues?.assignedCities ?? [],
    },
    mode: "onChange",
  });

  const residentialCountry = useWatch({ control, name: "residentialCountry" });
  const state = useWatch({ control, name: "state" });
  const country = useWatch({ control, name: "country" });
  const assignedCities = useWatch({ control, name: "assignedCities" }) ?? [];

  const allWorldCountries = Country.getAllCountries();

  const selectedResCountryObj = allWorldCountries.find((c) => c.name === residentialCountry);
  const stateOptions = selectedResCountryObj
    ? State.getStatesOfCountry(selectedResCountryObj.isoCode)
    : [];

  const selectedStateObj = stateOptions.find((s) => s.name === state);
  const cityOptions =
    selectedResCountryObj && selectedStateObj
      ? City.getCitiesOfState(selectedResCountryObj.isoCode, selectedStateObj.isoCode)
      : [];

  const { countries: countriesData } = useGetCountriesDropdown();
  const assignmentCountryOptions = countriesData.map((c) => c.name);

  const selectedAssignedCountryObjBackend = countriesData.find((c) => c.name === country);
  const { data: citiesDataResponse } = useGetCities({
    countryId: selectedAssignedCountryObjBackend?.id,
    limit: 1000,
  });
  const assignableCities = citiesDataResponse?.data?.map((c) => c.name) || [];

  const fieldError = (message?: string) =>
    message ? <p className="mt-1 text-xs font-medium text-red-500">{message}</p> : null;

  const inputClass =
    "h-11 rounded-xl border-slate-200 bg-slate-50/80 transition focus-visible:bg-white";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-5 overflow-y-auto p-6">
        <SectionShell
          icon={UserRound}
          title="Profile Photo"
          subtitle="Upload a clear headshot for the city manager profile"
          accent="bg-primary/10 text-primary"
        >
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                {previewImageUrl ? (
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl border-2 border-white shadow-lg ring-1 ring-slate-200">
                    <Image
                      src={previewImageUrl}
                      alt="Current manager"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : null}
                <div className="min-w-0 flex-1">
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    multiple={false}
                    maxFiles={1}
                    label={mode === "edit" ? "Replace photo" : "Upload manager photo"}
                    hint="PNG, JPG or WEBP · max 1 image"
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
                    <Input {...field} placeholder="Apt, suite (optional)" className={inputClass} />
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
                      <SelectTrigger className="h-11! w-full rounded-xl border-slate-200 bg-slate-50/80">
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
                        <SelectTrigger className="h-11! w-full rounded-xl border-slate-200 bg-slate-50/80">
                          <SelectValue
                            placeholder={
                              residentialCountry ? "Select state" : "Select country first"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {stateOptions.map((s) => (
                            <SelectItem key={s.isoCode} value={s.name}>
                              {s.name}
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
                        <SelectTrigger className="h-11! w-full rounded-xl border-slate-200 bg-slate-50/80">
                          <SelectValue placeholder={state ? "Select city" : "Select state first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {cityOptions.map((c) => (
                            <SelectItem key={c.name} value={c.name}>
                              {c.name}
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
          subtitle="Country coverage and cities this manager will handle"
          accent="bg-amber-100 text-amber-700"
        >
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <div className="max-w-md">
                <FieldLabel className="mb-1.5 text-sm font-semibold">
                  Country <span className="text-red-500">*</span>
                </FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={(v) => {
                    field.onChange(v ?? "");
                    setValue("assignedCities", []);
                  }}
                >
                  <SelectTrigger className="h-11! w-full rounded-xl border-slate-200 bg-slate-50/80">
                    <SelectValue placeholder="Select country to assign" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignmentCountryOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldError(errors.country?.message)}
              </div>
            )}
          />

          <Controller
            name="assignedCities"
            control={control}
            render={({ field }) => (
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <FieldLabel className="text-sm font-semibold">
                    Assign Cities <span className="text-red-500">*</span>
                  </FieldLabel>
                  {assignedCities.length > 0 ? (
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                      {assignedCities.length} selected
                    </span>
                  ) : null}
                </div>
                {!country ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-10 text-center">
                    <MapPin className="mb-2 size-8 text-slate-300" />
                    <p className="text-sm font-medium text-slate-600">Select a country first</p>
                    <p className="mt-1 text-xs text-slate-400">
                      City options will appear for that country
                    </p>
                  </div>
                ) : (
                  <div className="grid max-h-52 gap-2 overflow-y-auto rounded-2xl border border-slate-200 bg-linear-to-b from-slate-50 to-white p-3 sm:grid-cols-2 lg:grid-cols-3">
                    {assignableCities.map((cityName) => {
                      const active = field.value.includes(cityName);
                      return (
                        <label
                          key={cityName}
                          className={cn(
                            "flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition",
                            active
                              ? "border-amber-300 bg-amber-50 font-semibold text-amber-900 shadow-sm"
                              : "border-transparent bg-white text-slate-700 hover:border-slate-200 hover:shadow-sm",
                          )}
                        >
                          <Checkbox
                            checked={active}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, cityName]);
                              } else {
                                field.onChange(field.value.filter((c) => c !== cityName));
                              }
                            }}
                          />
                          {cityName}
                        </label>
                      );
                    })}
                  </div>
                )}
                {fieldError(errors.assignedCities?.message)}
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
