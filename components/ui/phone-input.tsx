"use client";

import { AsYouType, CountryCode } from "libphonenumber-js";
import { Check, ChevronDown, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  ALL_COUNTRIES,
  DEFAULT_ISO,
  findPhoneCountry,
  isDialOnlyInput,
  resolveFromValue,
  type PhoneCountry,
} from "@/components/ui/phone-input-utils";
import { getMaxNationalDigits, toPhoneDigits } from "@/lib/phone";
import { cn } from "@/lib/utils";

type PhoneChangeData = {
  dialCode: string;
  countryCode: string;
  name: string;
};

interface PhoneInputComponentProps {
  value: string;
  onChange: (value: string, data?: PhoneChangeData) => void;
  onBlur?: () => void;
  error?: boolean;
  disabled?: boolean;
  defaultCountry?: string;
  /**
   * - "international": value is dial+national (e.g. "13322359345") — default for profile/partner
   * - "national": value is national digits only (e.g. "3322359345") — use with split countryCode fields
   */
  valueMode?: "international" | "national";
  disableCountrySelect?: boolean;
}

function getDefaultCountryOverride(
  defaultCountry: string,
  countryOverride: PhoneCountry | null,
): PhoneCountry | undefined {
  const targetCountry = findPhoneCountry(defaultCountry);
  if (!targetCountry) return undefined;
  const dialOnly = isDialOnlyInput(defaultCountry);
  if (dialOnly && countryOverride && countryOverride.dialCode === targetCountry.dialCode) {
    // Keep the user's/selected ISO country (US vs CA, etc.)
    return undefined;
  }
  return targetCountry;
}

function usePhoneCountry(defaultCountry: string, value: string) {
  const initialTargetCountry = useMemo(() => findPhoneCountry(defaultCountry), [defaultCountry]);
  const [countryOverride, setCountryOverride] = useState<PhoneCountry | null>(
    initialTargetCountry || null,
  );
  const [prevDefaultCountry, setPrevDefaultCountry] = useState(defaultCountry);

  // Sync if defaultCountry prop changes externally — but never replace a locked
  // country with an ambiguous dial-only code (e.g. "+1" must not override "US").
  if (defaultCountry && defaultCountry !== prevDefaultCountry) {
    setPrevDefaultCountry(defaultCountry);
    const nextOverride = getDefaultCountryOverride(defaultCountry, countryOverride);
    if (nextOverride) {
      setCountryOverride(nextOverride);
    }
  }

  const activeCountry = countryOverride || initialTargetCountry;
  const activeIso = activeCountry?.isoCode || defaultCountry || DEFAULT_ISO;
  const resolved = useMemo(() => resolveFromValue(value, activeIso), [value, activeIso]);

  // Once a country is chosen (override or default ISO), keep that flag while typing.
  const selectedCountry = useMemo(() => {
    if (countryOverride) return countryOverride;
    if (initialTargetCountry) return initialTargetCountry;
    return resolved.country;
  }, [countryOverride, initialTargetCountry, resolved.country]);

  return { countryOverride, setCountryOverride, resolved, selectedCountry };
}

function PhoneCountryList({
  countries,
  selectedIsoCode,
  onSelect,
}: {
  countries: PhoneCountry[];
  selectedIsoCode: string;
  onSelect: (country: PhoneCountry) => void;
}) {
  if (countries.length === 0) {
    return <p className="px-3 py-6 text-center text-sm text-slate-500">No countries found</p>;
  }

  return countries.map((country) => {
    const isSelected = country.isoCode === selectedIsoCode;

    return (
      <Button
        key={country.isoCode}
        type="button"
        variant="ghost"
        onClick={() => onSelect(country)}
        className={cn(
          "flex h-10 w-full items-center justify-start gap-2.5 rounded-xl px-2.5 text-left text-sm font-normal text-slate-700 hover:bg-slate-100",
          isSelected && "bg-emerald-50 text-emerald-900 hover:bg-emerald-50",
        )}
      >
        <span aria-hidden className="text-base leading-none">
          {country.flag}
        </span>
        <span className="min-w-0 flex-1 truncate">{country.name}</span>
        <span className="shrink-0 text-slate-500 tabular-nums">+{country.dialCode}</span>
        {isSelected && <Check className="size-4 shrink-0 text-emerald-600" />}
      </Button>
    );
  });
}

export function PhoneInputComponent({
  value,
  onChange,
  onBlur,
  error,
  disabled,
  defaultCountry = DEFAULT_ISO,
  valueMode = "international",
  disableCountrySelect = false,
}: PhoneInputComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { setCountryOverride, resolved, selectedCountry } = usePhoneCountry(defaultCountry, value);
  const countrySelectDisabled = disabled || disableCountrySelect;

  const maxDigits = getMaxNationalDigits(selectedCountry.isoCode);

  const nationalNumber = useMemo(() => {
    const digits = toPhoneDigits(value || "");
    if (!digits) return "";

    // Split-field forms pass national digits only — never strip a dial prefix.
    if (valueMode === "national") {
      return digits.slice(0, maxDigits);
    }

    // International: value is dial + national. Always strip the selected dial for display
    // so typing/backspace never accumulates country-code digits (e.g. "1111...").
    if (digits.startsWith(selectedCountry.dialCode)) {
      return digits.slice(selectedCountry.dialCode.length).slice(0, maxDigits);
    }

    // Fallback: national-looking value without dial prefix
    if (digits.length <= maxDigits) {
      return digits.slice(0, maxDigits);
    }

    return resolved.nationalNumber.slice(0, maxDigits);
  }, [value, valueMode, selectedCountry.dialCode, resolved.nationalNumber, maxDigits]);

  const formattedNationalNumber = useMemo(() => {
    if (!nationalNumber) return "";

    // Format the number directly using AsYouType to get proper national formatting
    // complete with parentheses and dashes (e.g., (213) 373-4253 for US).
    const formatter = new AsYouType(selectedCountry.isoCode as CountryCode);
    const formatted = formatter.input(nationalNumber);

    // Replace spaces between digits with dashes (e.g. 6565 656 565 -> 6565-656-565)
    // but leave spaces after parentheses intact (e.g. (213) 373-4253).
    return formatted.replace(/(?<=\d) (?=\d)/g, "-");
  }, [nationalNumber, selectedCountry.isoCode]);

  const filteredCountries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return ALL_COUNTRIES;

    return ALL_COUNTRIES.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.dialCode.includes(query) ||
        country.isoCode.toLowerCase().includes(query) ||
        `+${country.dialCode}`.includes(query),
    );
  }, [searchQuery]);

  function emitChange(nextCountry: PhoneCountry, nextNational: string) {
    const limit = getMaxNationalDigits(nextCountry.isoCode);
    const national = toPhoneDigits(nextNational).slice(0, limit);
    const fullValue = `${nextCountry.dialCode}${national}`;
    onChange(fullValue, {
      dialCode: nextCountry.dialCode,
      countryCode: nextCountry.isoCode,
      name: nextCountry.name,
    });
  }

  function handleCountrySelect(country: PhoneCountry) {
    setCountryOverride(country);
    emitChange(country, nationalNumber);
    setIsOpen(false);
    setSearchQuery("");
  }

  function handleNumberChange(event: React.ChangeEvent<HTMLInputElement>) {
    const raw = event.target.value;
    let nextNational = toPhoneDigits(raw).slice(0, maxDigits);

    // If the user hit backspace on a formatting character (e.g. space or hyphen),
    // the raw string shrinks but the raw digits remain identical.
    if (raw.length < formattedNationalNumber.length && nextNational === nationalNumber) {
      // Find where the cursor is currently located
      const cursor = event.target.selectionStart ?? raw.length;

      // Isolate the digits before and after the cursor
      const digitsBeforeCursor = toPhoneDigits(raw.slice(0, cursor));
      const digitsAfterCursor = toPhoneDigits(raw.slice(cursor));

      // Manually remove the last digit that was immediately before the cursor
      nextNational = digitsBeforeCursor.slice(0, -1) + digitsAfterCursor;
    }

    emitChange(selectedCountry, nextNational);
  }

  return (
    <div
      className={cn(
        "flex h-12 w-full items-stretch overflow-visible rounded-xl border transition-colors",
        disabled
          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-600 shadow-none hover:border-slate-200"
          : "border-gray-200/80 bg-white focus-within:border-[#1B3A8C] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(27,58,140,0.1)] hover:border-slate-300",
        error &&
          "border-red-400 bg-red-50/40 focus-within:border-red-400 focus-within:shadow-[0_0_0_4px_rgba(248,113,113,0.12)]",
      )}
    >
      <Popover
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setSearchQuery("");
        }}
      >
        <PopoverTrigger
          disabled={countrySelectDisabled}
          render={
            <button
              type="button"
              disabled={countrySelectDisabled}
              aria-label="Select country code"
              className={cn(
                "flex h-full shrink-0 items-center gap-1 border-r border-slate-200/90 px-2.5 text-sm",
                countrySelectDisabled
                  ? "cursor-not-allowed text-slate-600 hover:bg-transparent"
                  : "text-slate-700 transition-colors hover:bg-slate-50",
                "focus-visible:ring-2 focus-visible:ring-[#1B3A8C]/25 focus-visible:outline-none",
              )}
            >
              <span aria-hidden className="text-base leading-none">
                {selectedCountry.flag}
              </span>
              <span className="font-semibold tabular-nums">+{selectedCountry.dialCode}</span>
              {!disableCountrySelect && (
                <ChevronDown
                  className={cn(
                    "size-3.5 text-slate-400 transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              )}
            </button>
          }
        />
        <PopoverContent
          align="start"
          side="bottom"
          sideOffset={6}
          className="z-300 w-[min(22rem,calc(100vw-2rem))] gap-2 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xl"
        >
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              autoFocus
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search country"
              className="h-10 rounded-xl border-slate-200 bg-slate-50/80 pl-9 text-sm"
            />
          </div>

          <div
            className="max-h-56 overflow-y-auto overscroll-contain rounded-xl"
            onWheel={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
          >
            <PhoneCountryList
              countries={filteredCountries}
              selectedIsoCode={selectedCountry.isoCode}
              onSelect={handleCountrySelect}
            />
          </div>
        </PopoverContent>
      </Popover>

      <input
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        disabled={disabled}
        value={formattedNationalNumber}
        onChange={handleNumberChange}
        onBlur={onBlur}
        placeholder={`${maxDigits}-digit number`}
        className={cn(
          "h-full min-w-0 flex-1 bg-transparent px-3 text-base text-slate-900 outline-none placeholder:text-slate-400 md:text-sm",
          disabled && "cursor-not-allowed text-slate-600",
        )}
      />
    </div>
  );
}

export default PhoneInputComponent;
