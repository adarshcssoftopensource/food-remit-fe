import { Label } from "@/components/ui/label";
import { CountrySelect } from "@/components/common/country-select";
import { CitySelect } from "@/components/common/city-select";

export function CountryCityFields({
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
  return (
    <>
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold text-slate-700">
          Country <span className="text-red-500">*</span>
        </Label>
        <CountrySelect
          value={countryValue}
          onValueChange={(v) => {
            onCountryChange(v);
            onCityChange("");
          }}
          placeholder="Select Country"
          includeAll={false}
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
          disabled={!countryValue}
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
