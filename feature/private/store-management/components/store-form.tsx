"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Camera, Plus, UserCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CITY_SELECT_OPTIONS,
  COUNTRY_PHONE_CODES,
  COUNTRY_SELECT_OPTIONS,
} from "@/constants/store-management";
import { storeSchema, type StoreFormValues } from "../schema/store.schema";

interface StoreFormProps {
  initialValues?: Partial<StoreFormValues>;
  onSubmit: (values: StoreFormValues) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}

function ImageUploadField({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value?: File | null;
  onChange: (file: File | null) => void;
  required?: boolean;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onChange(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </Label>
      <label className="group flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-3 transition-all hover:border-violet-400 hover:bg-violet-50/40">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {preview ? (
            <Image src={preview} alt="preview" fill className="object-cover" sizes="48px" />
          ) : (
            <div className="flex size-full items-center justify-center text-slate-300">
              <Camera className="size-5" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-600 group-hover:text-violet-700">
            {value ? value.name : "Click to upload image"}
          </p>
          <p className="text-xs text-slate-400">PNG, JPG or WEBP</p>
        </div>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}

function PhoneField({
  codeValue,
  onCodeChange,
  numberValue,
  onNumberChange,
  codeError,
  numberError,
  label,
  required,
}: {
  codeValue: string;
  onCodeChange: (v: string) => void;
  numberValue: string;
  onNumberChange: (v: string) => void;
  codeError?: string;
  numberError?: string;
  label: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </Label>
      <div className="flex gap-2">
        <Select value={codeValue} onValueChange={(value) => onCodeChange(value || "")}>
          <SelectTrigger className="h-11! w-32 shrink-0 rounded-xl border-slate-200 bg-slate-50">
            <SelectValue placeholder="Code" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {COUNTRY_PHONE_CODES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          value={numberValue}
          onChange={(e) => onNumberChange(e.target.value)}
          placeholder="Enter phone number"
          className="h-11 flex-1 rounded-xl border-slate-200 bg-slate-50"
        />
      </div>
      {(codeError || numberError) && (
        <p className="text-xs font-medium text-red-500">{codeError || numberError}</p>
      )}
    </div>
  );
}

function CountryCityFields({
  countryValue,
  onCountryChange,
  cityValue,
  onCityChange,
  stateValue,
  onStateChange,
  countryError,
  cityError,
  stateError,
  prefix,
}: {
  countryValue: string;
  onCountryChange: (v: string) => void;
  cityValue: string;
  onCityChange: (v: string) => void;
  stateValue: string;
  onStateChange: (v: string) => void;
  countryError?: string;
  cityError?: string;
  stateError?: string;
  prefix: string;
}) {
  const cities = countryValue ? (CITY_SELECT_OPTIONS[countryValue] ?? []) : [];

  return (
    <>
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold text-slate-700">
          Country <span className="text-red-500">*</span>
        </Label>
        <Select
          value={countryValue}
          onValueChange={(v: any) => {
            onCountryChange(v);
            onCityChange("");
          }}
        >
          <SelectTrigger className="h-11! w-full rounded-xl border-slate-200 bg-slate-50">
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {COUNTRY_SELECT_OPTIONS.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {countryError && <p className="text-xs font-medium text-red-500">{countryError}</p>}
      </div>

      <FormField label="State" error={stateError} required>
        <Input
          id={`${prefix}-state`}
          value={stateValue}
          onChange={(e) => onStateChange(e.target.value)}
          placeholder="Please Enter State"
          className="h-11 rounded-xl border-slate-200 bg-slate-50"
        />
      </FormField>

      <div className="space-y-1.5">
        <Label className="text-sm font-semibold text-slate-700">
          City <span className="text-red-500">*</span>
        </Label>
        <Select
          value={cityValue}
          onValueChange={(value) => onCityChange(value || "")}
          disabled={!countryValue}
        >
          <SelectTrigger className="h-11! w-full min-w-full rounded-xl border-slate-200">
            <SelectValue placeholder={countryValue ? "Select City" : "Select country first"} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {cityError && <p className="text-xs font-medium text-red-500">{cityError}</p>}
      </div>
    </>
  );
}

export function StoreForm({
  initialValues,
  onSubmit,
  submitLabel = "Add",
  isSubmitting = false,
}: StoreFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      storeImage: undefined,
      storeName: initialValues?.storeName ?? "",
      storePhoneCode: initialValues?.storePhoneCode ?? "+1",
      storePhoneNumber: initialValues?.storePhoneNumber ?? "",
      storeAddress: initialValues?.storeAddress ?? "",
      address2: initialValues?.address2 ?? "",
      storeCountry: initialValues?.storeCountry ?? "",
      storeState: initialValues?.storeState ?? "",
      storeCity: initialValues?.storeCity ?? "",
      storeZipCode: initialValues?.storeZipCode ?? "",
      storeTax: initialValues?.storeTax ?? undefined,
      foodRemitCommission: initialValues?.foodRemitCommission ?? undefined,
      managerImage: undefined,
      managerFirstName: initialValues?.managerFirstName ?? "",
      managerLastName: initialValues?.managerLastName ?? "",
      managerEmail: initialValues?.managerEmail ?? "",
      managerPhoneCode: initialValues?.managerPhoneCode ?? "+1",
      managerPhoneNumber: initialValues?.managerPhoneNumber ?? "",
      managerAddress: initialValues?.managerAddress ?? "",
      managerCountry: initialValues?.managerCountry ?? "",
      managerState: initialValues?.managerState ?? "",
      managerCity: initialValues?.managerCity ?? "",
      managerZipCode: initialValues?.managerZipCode ?? "",
    },
    mode: "onBlur",
  });

  const storeCountry = watch("storeCountry");
  void storeCountry;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex h-[calc(90vh-120px)] flex-col">
      <>
        <ScrollArea className={"flex-1 overflow-auto"}>
          <div className="grid gap-6 p-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
                <div className="flex size-9 items-center justify-center rounded-xl bg-violet-50">
                  <Building2 className="size-4 text-violet-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Store Details</h3>
                  <p className="text-xs text-slate-500">Basic information about the store</p>
                </div>
              </div>

              <div className="space-y-4 p-6">
                <Controller
                  name="storeImage"
                  control={control}
                  render={({ field }) => (
                    <ImageUploadField
                      label="Store Image"
                      value={field.value as File | null}
                      onChange={field.onChange}
                      required
                    />
                  )}
                />

                <Controller
                  name="storeName"
                  control={control}
                  render={({ field }) => (
                    <FormField label="Store Name" error={errors.storeName?.message} required>
                      <Input
                        {...field}
                        id="storeName"
                        placeholder="Enter Store Name"
                        className="h-11 rounded-xl border-slate-200 bg-slate-50"
                      />
                    </FormField>
                  )}
                />

                <Controller
                  name="storePhoneCode"
                  control={control}
                  render={({ field: codeField }) => (
                    <Controller
                      name="storePhoneNumber"
                      control={control}
                      render={({ field: numField }) => (
                        <PhoneField
                          label="Store Phone Number"
                          required
                          codeValue={codeField.value}
                          onCodeChange={codeField.onChange}
                          numberValue={numField.value}
                          onNumberChange={numField.onChange}
                          codeError={errors.storePhoneCode?.message}
                          numberError={errors.storePhoneNumber?.message}
                        />
                      )}
                    />
                  )}
                />

                <Controller
                  name="storeAddress"
                  control={control}
                  render={({ field }) => (
                    <FormField label="Address" error={errors.storeAddress?.message} required>
                      <Input
                        {...field}
                        id="storeAddress"
                        placeholder="Enter Address"
                        className="h-11 rounded-xl border-slate-200 bg-slate-50"
                      />
                    </FormField>
                  )}
                />

                <Controller
                  name="address2"
                  control={control}
                  render={({ field }) => (
                    <FormField label="Address 2">
                      <Input
                        {...field}
                        id="storeAddress2"
                        placeholder="Enter Address 2 (optional)"
                        className="h-11 rounded-xl border-slate-200 bg-slate-50"
                      />
                    </FormField>
                  )}
                />

                <Controller
                  name="storeCountry"
                  control={control}
                  render={({ field: cField }) => (
                    <Controller
                      name="storeState"
                      control={control}
                      render={({ field: sField }) => (
                        <Controller
                          name="storeCity"
                          control={control}
                          render={({ field: cityField }) => (
                            <CountryCityFields
                              prefix="store"
                              countryValue={cField.value}
                              onCountryChange={cField.onChange}
                              stateValue={sField.value}
                              onStateChange={sField.onChange}
                              cityValue={cityField.value}
                              onCityChange={cityField.onChange}
                              countryError={errors.storeCountry?.message}
                              stateError={errors.storeState?.message}
                              cityError={errors.storeCity?.message}
                            />
                          )}
                        />
                      )}
                    />
                  )}
                />

                <Controller
                  name="storeZipCode"
                  control={control}
                  render={({ field }) => (
                    <FormField label="Zip Code" error={errors.storeZipCode?.message}>
                      <Input
                        {...field}
                        id="storeZipCode"
                        placeholder="Please Enter Zipcode"
                        className="h-11 rounded-xl border-slate-200 bg-slate-50"
                      />
                    </FormField>
                  )}
                />

                <Controller
                  name="storeTax"
                  control={control}
                  render={({ field }) => (
                    <FormField label="Store Tax %" error={errors.storeTax?.message}>
                      <Input
                        {...field}
                        id="storeTax"
                        type="number"
                        min={0}
                        max={100}
                        step={0.01}
                        placeholder="Store Tax %"
                        className="h-11 rounded-xl border-slate-200 bg-slate-50"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                        }
                      />
                    </FormField>
                  )}
                />

                <Controller
                  name="foodRemitCommission"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      label="Food Remit Store Commission %"
                      error={errors.foodRemitCommission?.message}
                    >
                      <Input
                        {...field}
                        id="foodRemitCommission"
                        type="number"
                        min={0}
                        max={100}
                        step={0.01}
                        placeholder="Enter Commission %"
                        className="h-11 rounded-xl border-slate-200 bg-slate-50"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                        }
                      />
                    </FormField>
                  )}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
                <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50">
                  <UserCircle className="size-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Manager Details</h3>
                  <p className="text-xs text-slate-500">Information about the store manager</p>
                </div>
              </div>

              <div className="space-y-4 p-6">
                <Controller
                  name="managerImage"
                  control={control}
                  render={({ field }) => (
                    <ImageUploadField
                      label="Manager Image"
                      value={field.value as File | null}
                      onChange={field.onChange}
                      required
                    />
                  )}
                />

                <Controller
                  name="managerFirstName"
                  control={control}
                  render={({ field }) => (
                    <FormField label="First Name" error={errors.managerFirstName?.message} required>
                      <Input
                        {...field}
                        id="managerFirstName"
                        placeholder="Enter First Name"
                        className="h-11 rounded-xl border-slate-200 bg-slate-50"
                      />
                    </FormField>
                  )}
                />

                <Controller
                  name="managerLastName"
                  control={control}
                  render={({ field }) => (
                    <FormField label="Last Name" error={errors.managerLastName?.message} required>
                      <Input
                        {...field}
                        id="managerLastName"
                        placeholder="Enter Last Name"
                        className="h-11 rounded-xl border-slate-200 bg-slate-50"
                      />
                    </FormField>
                  )}
                />

                <Controller
                  name="managerEmail"
                  control={control}
                  render={({ field }) => (
                    <FormField label="Email Address" error={errors.managerEmail?.message} required>
                      <Input
                        {...field}
                        id="managerEmail"
                        type="email"
                        placeholder="Enter Email"
                        className="h-11 rounded-xl border-slate-200 bg-slate-50"
                      />
                    </FormField>
                  )}
                />

                <Controller
                  name="managerPhoneCode"
                  control={control}
                  render={({ field: codeField }) => (
                    <Controller
                      name="managerPhoneNumber"
                      control={control}
                      render={({ field: numField }) => (
                        <PhoneField
                          label="Manager Telephone Number"
                          required
                          codeValue={codeField.value}
                          onCodeChange={codeField.onChange}
                          numberValue={numField.value}
                          onNumberChange={numField.onChange}
                          codeError={errors.managerPhoneCode?.message}
                          numberError={errors.managerPhoneNumber?.message}
                        />
                      )}
                    />
                  )}
                />

                <Controller
                  name="managerAddress"
                  control={control}
                  render={({ field }) => (
                    <FormField label="Address" error={errors.managerAddress?.message} required>
                      <Input
                        {...field}
                        id="managerAddress"
                        placeholder="Enter Address"
                        className="h-11 rounded-xl border-slate-200 bg-slate-50"
                      />
                    </FormField>
                  )}
                />

                <Controller
                  name="managerCountry"
                  control={control}
                  render={({ field: cField }) => (
                    <Controller
                      name="managerState"
                      control={control}
                      render={({ field: sField }) => (
                        <Controller
                          name="managerCity"
                          control={control}
                          render={({ field: cityField }) => (
                            <CountryCityFields
                              prefix="manager"
                              countryValue={cField.value}
                              onCountryChange={cField.onChange}
                              stateValue={sField.value}
                              onStateChange={sField.onChange}
                              cityValue={cityField.value}
                              onCityChange={cityField.onChange}
                              countryError={errors.managerCountry?.message}
                              stateError={errors.managerState?.message}
                              cityError={errors.managerCity?.message}
                            />
                          )}
                        />
                      )}
                    />
                  )}
                />

                <Controller
                  name="managerZipCode"
                  control={control}
                  render={({ field }) => (
                    <FormField label="Zipcode" error={errors.managerZipCode?.message}>
                      <Input
                        {...field}
                        id="managerZipCode"
                        placeholder="Enter Zipcode"
                        className="h-11 rounded-xl border-slate-200 bg-slate-50"
                      />
                    </FormField>
                  )}
                />
              </div>
            </div>
          </div>
        </ScrollArea>
      </>

      <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50/50 px-6 py-4">
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="h-11 min-w-30 rounded-xl px-8 font-semibold shadow-sm"
        >
          <Plus /> {submitLabel}
        </Button>
      </div>
    </form>
  );
}
