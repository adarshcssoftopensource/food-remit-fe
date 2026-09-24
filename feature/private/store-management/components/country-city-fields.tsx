import { Label } from "@/components/ui/label";
import { CountrySelect } from "@/components/common/country-select";
import { CitySelect } from "@/components/common/city-select";

import type { CountryDropdownItem } from "@/feature/private/settings/types/settings.types";

export function CountryCityFields({
  countryValue,
  onCountryChange,
  cityValue,
  onCityChange,
  countryError,
  cityError,
  disabled = false,
  countryDisabled = false,
}: {
  countryValue: string;
  onCountryChange: (v: string, country?: CountryDropdownItem) => void;
  cityValue: string;
  onCityChange: (v: string) => void;
  countryError?: string;
  cityError?: string;
  prefix: string;
  stateValue?: string;
  onStateChange?: (v: string) => void;
  stateError?: string;
  disabled?: boolean;
  countryDisabled?: boolean;
}) {
  return (
    <>
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold text-slate-700">
          Country <span className="text-red-500">*</span>
        </Label>
        <CountrySelect
          value={countryValue}
          onValueChange={(v, country) => {
            onCountryChange(v, country);
            onCityChange("");
          }}
          placeholder="Select Country"
          includeAll={false}
          disabled={disabled || countryDisabled}
          invalid={!!countryError}
          className={countryError ? "border-red-500 bg-red-50" : ""}
        />
        {countryError && <p className="text-xs font-medium text-red-500">{countryError}</p>}
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-semibold text-slate-700">
          City <span className="text-red-500">*</span>
        </Label>
        <CitySelect
          countryId={countryValue}
          value={cityValue}
          onValueChange={(v) => onCityChange(v)}
          disabled={disabled || !countryValue}
          placeholder="Select City"
          includeAll={false}
          invalid={!!cityError}
          className={cityError ? "border-red-500 bg-red-50" : ""}
        />
        {cityError && <p className="text-xs font-medium text-red-500">{cityError}</p>}
      </div>
    </>
  );
}
