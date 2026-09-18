"use client";

import { Country } from "country-state-city";
import { Check, ChevronDown, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getMaxNationalDigits, toPhoneDigits } from "@/lib/phone";
import { cn } from "@/lib/utils";

type PhoneCountry = {
  name: string;
  isoCode: string;
  flag: string;
  dialCode: string;
};

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
}

const DEFAULT_ISO = "IN";

/** When multiple countries share a dial code, prefer this ISO. */
const PREFERRED_ISO_BY_DIAL: Record<string, string> = {
  "1": "US", // USA / Canada / Caribbean — default to USA
};

function buildCountries(): PhoneCountry[] {
  return Country.getAllCountries()
    .map((country) => {
      const dialCode = toPhoneDigits(country.phonecode);
      if (!dialCode) return null;
      return {
        name: country.name,
        isoCode: country.isoCode,
        flag: country.flag,
        dialCode,
      };
    })
    .filter((country): country is PhoneCountry => Boolean(country))
    .sort((a, b) => a.name.localeCompare(b.name));
}

const ALL_COUNTRIES = buildCountries();
const COUNTRIES_BY_ISO = new Map(ALL_COUNTRIES.map((country) => [country.isoCode, country]));
const DIAL_CODES_DESC = [...ALL_COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length);

function isDialOnlyInput(input: string): boolean {
  const trimmed = input.trim();
  if (!trimmed) return false;
  // "+1", "1", "+91" — not "US", "United States", "CA"
  return /^\+?\d{1,4}$/.test(trimmed);
}

export function findPhoneCountry(input?: string | null): PhoneCountry | undefined {
  if (!input) return undefined;
  const trimmed = input.trim();
  if (!trimmed) return undefined;

  // 1. Direct ISO code match (e.g. "IN", "US", "CA", "GB")
  const upper = trimmed.toUpperCase();
  const byIso = COUNTRIES_BY_ISO.get(upper);
  if (byIso) return byIso;

  // 2. Common aliases
  const lower = trimmed.toLowerCase();
  if (
    lower === "usa" ||
    lower === "united states of america" ||
    lower === "united states" ||
    lower === "us"
  )
    return COUNTRIES_BY_ISO.get("US");
  if (lower === "canada" || lower === "ca") return COUNTRIES_BY_ISO.get("CA");
  if (lower === "uk" || lower === "united kingdom" || lower === "gb")
    return COUNTRIES_BY_ISO.get("GB");
  if (lower === "uae" || lower === "united arab emirates" || lower === "ae")
    return COUNTRIES_BY_ISO.get("AE");

  // 3. Exact country name match (case-insensitive)
  const byName = ALL_COUNTRIES.find((c) => c.name.toLowerCase() === lower);
  if (byName) return byName;

  // 4. Prefix / substring match (avoid matching dial-only strings as names)
  if (!isDialOnlyInput(trimmed)) {
    const byPrefix = ALL_COUNTRIES.find(
      (c) => lower.startsWith(c.name.toLowerCase()) || c.name.toLowerCase().startsWith(lower),
    );
    if (byPrefix) return byPrefix;

    const cscMatch = Country.getAllCountries().find(
      (c) =>
        c.name.toLowerCase() === lower ||
        c.isoCode.toLowerCase() === lower ||
        lower.startsWith(c.name.toLowerCase()) ||
        c.name.toLowerCase().startsWith(lower),
    );
    if (cscMatch) {
      const fromCsc = COUNTRIES_BY_ISO.get(cscMatch.isoCode);
      if (fromCsc) return fromCsc;
    }
  }

  // 5. Dial code match — prefer a canonical country for shared codes (e.g. +1 → US)
  const cleanDigits = toPhoneDigits(trimmed);
  if (cleanDigits) {
    const preferredIso = PREFERRED_ISO_BY_DIAL[cleanDigits];
    if (preferredIso) {
      const preferred = COUNTRIES_BY_ISO.get(preferredIso);
      if (preferred && preferred.dialCode === cleanDigits) return preferred;
    }
    const byDial = DIAL_CODES_DESC.find((c) => c.dialCode === cleanDigits);
    if (byDial) return byDial;
  }

  return undefined;
}

export function resolveFromValue(
  value: string,
  defaultCountryOrIso = DEFAULT_ISO,
): { country: PhoneCountry; nationalNumber: string } {
  const digits = toPhoneDigits(value || "");
  const fallback =
    findPhoneCountry(defaultCountryOrIso) ?? COUNTRIES_BY_ISO.get(DEFAULT_ISO) ?? ALL_COUNTRIES[0];

  if (!digits) {
    return { country: fallback, nationalNumber: "" };
  }

  // Always prefer the active/default country when its dial matches the value prefix.
  // This keeps USA selected for +1 instead of flipping to Canada while typing.
  if (fallback && digits.startsWith(fallback.dialCode)) {
    return {
      country: fallback,
      nationalNumber: digits.slice(fallback.dialCode.length),
    };
  }

  // Shared dial codes: prefer canonical country (e.g. +1 → US, never CA by accident)
  const matched = DIAL_CODES_DESC.find((country) => digits.startsWith(country.dialCode));
  if (!matched) {
    return { country: fallback, nationalNumber: digits };
  }

  const preferredIso = PREFERRED_ISO_BY_DIAL[matched.dialCode];
  if (preferredIso) {
    const preferred = COUNTRIES_BY_ISO.get(preferredIso);
    if (preferred && preferred.dialCode === matched.dialCode) {
      return {
        country: preferred,
        nationalNumber: digits.slice(preferred.dialCode.length),
      };
    }
  }

  return {
    country: matched,
    nationalNumber: digits.slice(matched.dialCode.length),
  };
}

export function PhoneInputComponent({
  value,
  onChange,
  onBlur,
  error,
  disabled,
  defaultCountry = DEFAULT_ISO,
}: PhoneInputComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const initialTargetCountry = useMemo(() => findPhoneCountry(defaultCountry), [defaultCountry]);
  const [countryOverride, setCountryOverride] = useState<PhoneCountry | null>(
    initialTargetCountry || null,
  );
  const [prevDefaultCountry, setPrevDefaultCountry] = useState(defaultCountry);

  // Sync if defaultCountry prop changes externally — but never replace a locked
  // country with an ambiguous dial-only code (e.g. "+1" must not override "US").
  if (defaultCountry && defaultCountry !== prevDefaultCountry) {
    setPrevDefaultCountry(defaultCountry);
    const targetCountry = findPhoneCountry(defaultCountry);
    if (targetCountry) {
      const dialOnly = isDialOnlyInput(defaultCountry);
      if (dialOnly && countryOverride && countryOverride.dialCode === targetCountry.dialCode) {
        // Keep the user's/selected ISO country (US vs CA, etc.)
      } else {
        setCountryOverride(targetCountry);
      }
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

  const maxDigits = getMaxNationalDigits(selectedCountry.isoCode);

  const nationalNumber = useMemo(() => {
    const digits = toPhoneDigits(value || "");
    if (!digits) return "";
    if (digits.startsWith(selectedCountry.dialCode)) {
      return digits.slice(selectedCountry.dialCode.length).slice(0, maxDigits);
    }
    return resolved.nationalNumber.slice(0, maxDigits);
  }, [value, selectedCountry.dialCode, resolved.nationalNumber, maxDigits]);

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

  function handleNumberChange(nextNational: string) {
    // Always emit with the currently selected country — never re-resolve by digits.
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
          disabled={disabled}
          render={
            <button
              type="button"
              disabled={disabled}
              aria-label="Select country code"
              className={cn(
                "flex h-full shrink-0 items-center gap-1 border-r border-slate-200/90 px-2.5 text-sm",
                disabled
                  ? "cursor-not-allowed text-slate-600 hover:bg-transparent"
                  : "text-slate-700 transition-colors hover:bg-slate-50",
                "focus-visible:ring-2 focus-visible:ring-[#1B3A8C]/25 focus-visible:outline-none",
              )}
            >
              <span aria-hidden className="text-base leading-none">
                {selectedCountry.flag}
              </span>
              <span className="font-semibold tabular-nums">+{selectedCountry.dialCode}</span>
              <ChevronDown
                className={cn(
                  "size-3.5 text-slate-400 transition-transform",
                  isOpen && "rotate-180",
                )}
              />
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
            {filteredCountries.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-slate-500">No countries found</p>
            ) : (
              filteredCountries.map((country) => {
                const isSelected = country.isoCode === selectedCountry.isoCode;

                return (
                  <Button
                    key={country.isoCode}
                    type="button"
                    variant="ghost"
                    onClick={() => handleCountrySelect(country)}
                    className={cn(
                      "flex h-10 w-full items-center justify-start gap-2.5 rounded-xl px-2.5 text-left text-sm font-normal text-slate-700 hover:bg-slate-100",
                      isSelected && "bg-emerald-50 text-emerald-900 hover:bg-emerald-50",
                    )}
                  >
                    <span aria-hidden className="text-base leading-none">
                      {country.flag}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{country.name}</span>
                    <span className="shrink-0 text-slate-500 tabular-nums">
                      +{country.dialCode}
                    </span>
                    {isSelected && <Check className="size-4 shrink-0 text-emerald-600" />}
                  </Button>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>

      <input
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        disabled={disabled}
        value={nationalNumber}
        maxLength={maxDigits}
        onChange={(event) => handleNumberChange(event.target.value)}
        onBlur={onBlur}
        placeholder={`${maxDigits}-digit number`}
        className={cn(
          "h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400",
          disabled && "cursor-not-allowed text-slate-600",
        )}
      />
    </div>
  );
}

export default PhoneInputComponent;
