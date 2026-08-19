import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCities } from "../../settings/hooks/use-get-cities";
import { useGetCountriesDropdown } from "../../settings/hooks/use-get-countries-dropdown";

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
