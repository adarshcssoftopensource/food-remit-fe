import { ResidentialCountrySelect } from "@/components/common/residential-country-select";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { City, Country, State } from "country-state-city";

export function ManagerLocationFields({
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
          Residential Country <span className="text-red-500">*</span>
        </Label>
        <ResidentialCountrySelect
          value={countryValue}
          onValueChange={(name) => {
            onCountryChange(name);
            onStateChange("");
            onCityChange("");
          }}
          invalid={!!countryError}
        />
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
