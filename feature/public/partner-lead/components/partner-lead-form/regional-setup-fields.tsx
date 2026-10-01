import { Globe } from "lucide-react";
import { Controller } from "react-hook-form";
import { AddressAutocompleteInput } from "@/components/common/address-autocomplete-input";
import { CountrySelect } from "@/components/common/country-select";
import { WorldCitySelect } from "@/components/common/world-city-select";
import { WorldStateSelect } from "@/components/common/world-state-select";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PhoneInputComponent } from "@/components/ui/phone-input";
import { applyPlaceToLocationFields } from "@/lib/places/apply-place-to-location-fields";
import type { PartnerLeadFormState } from "../../hooks/use-partner-lead-form";

type RegionalSetupFieldsProps = Pick<
  PartnerLeadFormState,
  | "control"
  | "errors"
  | "setValue"
  | "clearErrors"
  | "selectedCountryName"
  | "selectedCountryIsoCode"
  | "selectedStateIsoCode"
>;

export function RegionalSetupFields({
  control,
  errors,
  setValue,
  clearErrors,
  selectedCountryName,
  selectedCountryIsoCode,
  selectedStateIsoCode,
}: RegionalSetupFieldsProps) {
  return (
    <div className="mt-3 flex flex-col gap-3 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50 p-2.5 sm:p-5">
      <div className="flex items-center gap-2 border-b border-slate-200/60 pb-2">
        <Globe className="size-4.5 text-emerald-600" />
        <div>
          <h3 className="text-sm font-bold text-slate-900">Regional Setup</h3>
          <p className="text-xs text-slate-500">
            Provide the primary country, state, and city for your business.
          </p>
        </div>
      </div>{" "}
      <div className="grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-6">
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5 xl:col-span-3">
              <FieldLabel htmlFor="country" className="text-xs font-semibold text-slate-700">
                Country <span className="text-red-500">*</span>
              </FieldLabel>

              <CountrySelect
                value={field.value}
                onValueChange={(val) => {
                  field.onChange(val);
                  setValue("stateProvinceRegion", "");
                  setValue("businessCity", "");
                  setValue("locations.0.address" as const, "");
                  setValue("storePhoneNumber", "");
                  setValue("zipCode", "");
                  clearErrors([
                    "country",
                    "stateProvinceRegion",
                    "businessCity",
                    "locations",
                    "storePhoneNumber",
                    "zipCode",
                  ]);
                }}
                id="country"
                invalid={Boolean(errors.country)}
                valueKey="name"
              />

              {errors.country && (
                <p className="text-xs font-medium text-red-500">{errors.country.message}</p>
              )}
            </div>
          )}
        />

        <Controller
          name="currency"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5 xl:col-span-3">
              <FieldLabel htmlFor="currency" className="text-xs font-semibold text-slate-700">
                Currency <span className="font-normal text-slate-400">(Auto-detected)</span>
              </FieldLabel>

              <Input
                {...field}
                value={field.value || ""}
                id="currency"
                readOnly
                placeholder="Currency will appear here"
                className="h-11 cursor-not-allowed rounded-xl border-slate-200 bg-slate-50 text-sm font-medium text-slate-600 focus-visible:ring-0"
              />
            </div>
          )}
        />

        <Controller
          name={"locations.0.address" as const}
          control={control}
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-1.5 xl:col-span-6">
              <FieldLabel htmlFor="storeAddress" className="text-xs font-semibold text-slate-700">
                Store Address <span className="text-red-500">*</span>
              </FieldLabel>
              <AddressAutocompleteInput
                id="storeAddress"
                value={field.value || ""}
                onChange={(val) => {
                  field.onChange(val);
                  clearErrors("locations");
                }}
                onPlaceSelect={(place) => {
                  applyPlaceToLocationFields(place, setValue, {
                    country: "country",
                    state: "stateProvinceRegion",
                    city: "businessCity",
                    zipcode: "zipCode",
                  });
                  clearErrors(["stateProvinceRegion", "businessCity", "zipCode"]);
                }}
                addressFormat="street"
                placeholder={
                  selectedCountryIsoCode ? "Enter store address" : "Select country to enter address"
                }
                disabled={!selectedCountryIsoCode}
                invalid={!!(fieldState.error || errors.locations?.[0]?.address)}
                countryCode={selectedCountryIsoCode || undefined}
              />
              {(fieldState.error || errors.locations?.[0]?.address) && (
                <p className="text-xs font-medium text-red-500">
                  {fieldState.error?.message || errors.locations?.[0]?.address?.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          name="stateProvinceRegion"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5 xl:col-span-2">
              <FieldLabel
                htmlFor="stateProvinceRegion"
                className="text-xs font-semibold text-slate-700"
              >
                State / Province / Region{" "}
                <span className="font-normal text-slate-400">(Optional)</span>
              </FieldLabel>

              <WorldStateSelect
                id="stateProvinceRegion"
                countryIsoCode={selectedCountryIsoCode}
                value={field.value}
                onValueChange={(stateName) => {
                  field.onChange(stateName);
                  setValue("businessCity", "");
                  clearErrors(["stateProvinceRegion", "businessCity"]);
                }}
                disabled={!selectedCountryIsoCode}
                invalid={Boolean(errors.stateProvinceRegion)}
                placeholder={
                  selectedCountryIsoCode ? "Select state or region" : "Select country first"
                }
                allowCustom
              />

              {errors.stateProvinceRegion && (
                <p className="text-xs font-medium text-red-500">
                  {errors.stateProvinceRegion.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          name="businessCity"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5 xl:col-span-2">
              <FieldLabel htmlFor="businessCity" className="text-xs font-semibold text-slate-700">
                Business City <span className="text-red-500">*</span>
              </FieldLabel>

              <WorldCitySelect
                id="businessCity"
                countryIsoCode={selectedCountryIsoCode}
                stateCode={selectedStateIsoCode}
                value={field.value}
                onValueChange={(cityName) => {
                  field.onChange(cityName);
                  clearErrors("businessCity");
                }}
                disabled={!selectedCountryIsoCode}
                invalid={Boolean(errors.businessCity)}
                placeholder={selectedCountryIsoCode ? "Select city" : "Select country first"}
                allowCustom
              />

              {errors.businessCity && (
                <p className="text-xs font-medium text-red-500">{errors.businessCity.message}</p>
              )}
            </div>
          )}
        />

        <Controller
          name="zipCode"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5 xl:col-span-2">
              <FieldLabel htmlFor="zipCode" className="text-xs font-semibold text-slate-700">
                Zip Code <span className="font-normal text-slate-400">(Optional)</span>
              </FieldLabel>

              <Input
                {...field}
                value={field.value || ""}
                id="zipCode"
                placeholder="e.g. 177107"
                aria-invalid={Boolean(errors.zipCode)}
                className="focus-visible:ring-primary/10 h-11 rounded-xl border-slate-200 bg-white text-sm"
              />

              {errors.zipCode && (
                <p className="text-xs font-medium text-red-500">{errors.zipCode.message}</p>
              )}
            </div>
          )}
        />

        <Controller
          name="storePhoneNumber"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5 xl:col-span-6">
              <FieldLabel
                htmlFor="storePhoneNumber"
                className="text-xs font-semibold text-slate-700"
              >
                Store Phone Number <span className="text-red-500">*</span>
              </FieldLabel>
              <PhoneInputComponent
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  clearErrors("storePhoneNumber");
                }}
                onBlur={field.onBlur}
                error={!!errors.storePhoneNumber}
                disabled={!selectedCountryIsoCode}
                defaultCountry={selectedCountryIsoCode || selectedCountryName || "US"}
                disableCountrySelect
              />
              {errors.storePhoneNumber && (
                <p className="text-xs font-medium text-red-500">
                  {errors.storePhoneNumber.message}
                </p>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
}
