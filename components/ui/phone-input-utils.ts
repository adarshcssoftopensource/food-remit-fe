import { Country } from "country-state-city";

import { getMaxNationalDigits, toPhoneDigits } from "@/lib/phone";

export type PhoneCountry = {
  name: string;
  isoCode: string;
  flag: string;
  dialCode: string;
};

export const DEFAULT_ISO = "IN";

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

export const ALL_COUNTRIES = buildCountries();
const COUNTRIES_BY_ISO = new Map(ALL_COUNTRIES.map((country) => [country.isoCode, country]));
const DIAL_CODES_DESC = [...ALL_COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length);

export function isDialOnlyInput(input: string): boolean {
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
  const fallback = (findPhoneCountry(defaultCountryOrIso) ??
    COUNTRIES_BY_ISO.get(DEFAULT_ISO) ??
    ALL_COUNTRIES[0])!;

  if (!digits) {
    return { country: fallback, nationalNumber: "" };
  }

  // Prefer the active/default country when its dial matches the value prefix.
  if (fallback && digits.startsWith(fallback.dialCode)) {
    return {
      country: fallback,
      nationalNumber: digits.slice(fallback.dialCode.length),
    };
  }

  // Locked country + national-only digits (fits that country's max length):
  // keep as national — do not match France (+33) against a US number like 3322...
  if (fallback) {
    const maxNat = getMaxNationalDigits(fallback.isoCode);
    if (digits.length <= maxNat) {
      return { country: fallback, nationalNumber: digits };
    }
  }

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
