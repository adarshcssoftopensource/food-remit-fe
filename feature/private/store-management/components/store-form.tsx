"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, UserCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInputComponent } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Country, State, City } from "country-state-city";
import { storeSchema, type StoreFormValues } from "../schema/store.schema";
import { useGetCities } from "../../settings/hooks/use-get-cities";
import { useGetCountriesDropdown } from "../../settings/hooks/use-get-countries-dropdown";
import { ImageUpload } from "@/components/common/image-upload";

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
      <PhoneInputComponent
        value={(codeValue || "") + (numberValue || "")}
        onChange={(val, data) => {
          if (data && data.dialCode) {
            const dialCode = data.dialCode;
            let nationalNumber = val;
            if (val.startsWith(dialCode)) {
              nationalNumber = val.slice(dialCode.length);
            }
            onCodeChange("+" + dialCode);
            onNumberChange(nationalNumber);
          } else {
            onNumberChange(val);
          }
        }}
        error={!!(codeError || numberError)}
      />
      {(codeError || numberError) && (
        <p className="text-xs font-medium text-red-500">{codeError || numberError}</p>
      )}
    </div>
  );
}

// ── Store Location: uses custom DB countries & cities ──────────────────────
function CountryCityFields({
  countryValue,
  onCountryChange,
  cityValue,
  onCityChange,
  countryError,
  cityError,
}: {
  countryValue: string;
  onCountryChange: (v: string) => void;
  cityValue: string;
  onCityChange: (v: string) => void;
  countryError?: string;
  cityError?: string;
  prefix: string;
  stateValue?: string;
  onStateChange?: (v: string) => void;
  stateError?: string;
}) {
  const { countries: countriesData } = useGetCountriesDropdown();
  const { data: citiesDataResponse } = useGetCities({
    countryId: countryValue,
    limit: 1000,
  });

  const cityOptions = citiesDataResponse?.data || [];

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
            <SelectValue placeholder="Select Country">
              {countriesData.find((c) => c.id === countryValue)?.name || "Select Country"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {countriesData.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {countryError && <p className="text-xs font-medium text-red-500">{countryError}</p>}
      </div>

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
            <SelectValue placeholder={countryValue ? "Select City" : "Select country first"}>
              {cityOptions.find((c) => c.id === cityValue)?.name ||
                (countryValue ? "Select City" : "Select country first")}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {cityOptions.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
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

// ── Manager Location: uses standard world-wide Country → State → City ───────
function ManagerLocationFields({
  countryValue,
  onCountryChange,
  cityValue,
  onCityChange,
  stateValue,
  onStateChange,
  countryError,
  cityError,
  stateError,
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
}) {
  const allCountries = Country.getAllCountries();
  const selectedCountryObj = allCountries.find((c) => c.name === countryValue);
  const stateOptions = selectedCountryObj
    ? State.getStatesOfCountry(selectedCountryObj.isoCode)
    : [];
  const selectedStateObj = stateOptions.find((s) => s.name === stateValue);
  const cityOptions =
    selectedCountryObj && selectedStateObj
      ? City.getCitiesOfState(selectedCountryObj.isoCode, selectedStateObj.isoCode)
      : [];

  return (
    <>
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold text-slate-700">
          Country <span className="text-red-500">*</span>
        </Label>
        <Select
          value={countryValue}
          onValueChange={(v) => {
            onCountryChange(v ?? "");
            onStateChange("");
            onCityChange("");
          }}
        >
          <SelectTrigger className="h-11! w-full rounded-xl border-slate-200 bg-slate-50">
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {allCountries.map((c) => (
                <SelectItem key={c.isoCode} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {countryError && <p className="text-xs font-medium text-red-500">{countryError}</p>}
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-semibold text-slate-700">
          State <span className="text-red-500">*</span>
        </Label>
        <Select
          value={stateValue}
          onValueChange={(v) => {
            onStateChange(v ?? "");
            onCityChange("");
          }}
          disabled={!countryValue}
        >
          <SelectTrigger className="h-11! w-full rounded-xl border-slate-200 bg-slate-50">
            <SelectValue placeholder={countryValue ? "Select State" : "Select country first"} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {stateOptions.map((s) => (
                <SelectItem key={s.isoCode} value={s.name}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {stateError && <p className="text-xs font-medium text-red-500">{stateError}</p>}
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-semibold text-slate-700">
          City <span className="text-red-500">*</span>
        </Label>
        <Select
          value={cityValue}
          onValueChange={(value) => onCityChange(value || "")}
          disabled={!stateValue}
        >
          <SelectTrigger className="h-11! w-full min-w-full rounded-xl border-slate-200">
            <SelectValue placeholder={stateValue ? "Select City" : "Select state first"} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {cityOptions.map((c) => (
                <SelectItem key={c.name} value={c.name}>
                  {c.name}
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
    formState: { errors },
  } = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      storeImage: initialValues?.storeImage ?? undefined,
      storeName: initialValues?.storeName ?? "",
      storePhoneCode: initialValues?.storePhoneCode ?? "+91",
      storePhoneNumber: initialValues?.storePhoneNumber ?? "",
      storeAddress: initialValues?.storeAddress ?? "",
      address2: initialValues?.address2 ?? "",
      storeCountry: initialValues?.storeCountry ?? "",
      storeCity: initialValues?.storeCity ?? "",
      storeTax: initialValues?.storeTax ?? undefined,
      foodRemitCommission: initialValues?.foodRemitCommission ?? undefined,
      managerImage: initialValues?.managerImage ?? undefined,
      managerFirstName: initialValues?.managerFirstName ?? "",
      managerLastName: initialValues?.managerLastName ?? "",
      managerEmail: initialValues?.managerEmail ?? "",
      managerPhoneCode: initialValues?.managerPhoneCode ?? "+91",
      managerPhoneNumber: initialValues?.managerPhoneNumber ?? "",
      managerAddress: initialValues?.managerAddress ?? "",
      managerCountry: initialValues?.managerCountry ?? "",
      managerState: initialValues?.managerState ?? "",
      managerCity: initialValues?.managerCity ?? "",
      managerZipCode: initialValues?.managerZipCode ?? "",
    },
    mode: "onBlur",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="grid gap-6 p-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
              <div className="bg-primary/10 flex size-9 items-center justify-center rounded-xl">
                <Building2 className="text-primary size-4" />
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
                  <ImageUpload
                    label="Upload store image"
                    hint="PNG, JPG or WEBP · max 1 image"
                    maxFiles={1}
                    multiple={false}
                    onChange={(files) => field.onChange(files[0] || null)}
                    value={
                      field.value && typeof field.value !== "string" ? [field.value as File] : []
                    }
                    initialImages={initialValues?.storeImage ? [initialValues.storeImage] : []}
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
                    name="storeCity"
                    control={control}
                    render={({ field: cityField }) => (
                      <CountryCityFields
                        prefix="store"
                        countryValue={cField.value}
                        onCountryChange={cField.onChange}
                        stateValue=""
                        onStateChange={() => {}}
                        cityValue={cityField.value}
                        onCityChange={cityField.onChange}
                        countryError={errors.storeCountry?.message}
                        cityError={errors.storeCity?.message}
                      />
                    )}
                  />
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
                  <ImageUpload
                    label="Upload manager image"
                    hint="PNG, JPG or WEBP · max 1 image"
                    maxFiles={1}
                    multiple={false}
                    onChange={(files) => field.onChange(files[0] || null)}
                    value={
                      field.value && typeof field.value !== "string" ? [field.value as File] : []
                    }
                    initialImages={initialValues?.managerImage ? [initialValues.managerImage] : []}
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
                          <ManagerLocationFields
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
