import { Country } from "country-state-city";
import {
  type CountryCode,
  getExampleNumber,
  isSupportedCountry,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import { Metadata } from "libphonenumber-js/core";
import metadata from "libphonenumber-js/metadata.min.json";
import examples from "libphonenumber-js/mobile/examples";

export function toPhoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

function asCountryCode(code?: string | null): CountryCode | null {
  if (!code) return null;
  const normalized = code.toUpperCase();
  return isSupportedCountry(normalized) ? (normalized as CountryCode) : null;
}

export function getMaxNationalDigits(countryCode?: string | null): number {
  const cc = asCountryCode(countryCode);
  if (!cc) return 15;

  try {
    const example = getExampleNumber(cc, examples);
    if (example?.nationalNumber) {
      return example.nationalNumber.length;
    }
  } catch {
    // fall through
  }

  try {
    const meta = new Metadata(metadata);
    meta.selectNumberingPlan(cc);
    const lengths = meta.numberingPlan?.possibleLengths() ?? [];
    if (lengths.length > 0) return Math.max(...lengths);
  } catch {
    // fall through
  }

  return 15;
}

export function getExpectedNationalDigits(countryCode?: string | null): number | null {
  const cc = asCountryCode(countryCode);
  if (!cc) return null;

  try {
    const example = getExampleNumber(cc, examples);
    if (example?.nationalNumber) return example.nationalNumber.length;
  } catch {
    // ignore
  }

  return null;
}

export function getNationalPhoneError(
  nationalNumber: string,
  countryCode?: string | null,
): string | null {
  const digits = toPhoneDigits(nationalNumber);
  const cc = asCountryCode(countryCode);
  const expected = getExpectedNationalDigits(cc);

  if (!digits) return "Phone number is required";

  if (cc) {
    if (expected && digits.length !== expected) {
      return `Enter a valid ${expected}-digit phone number`;
    }
    if (expected && digits.length === expected) {
      return null;
    }
    if (!isValidPhoneNumber(digits, cc)) {
      return expected
        ? `Enter a valid ${expected}-digit phone number`
        : "Enter a valid phone number";
    }
    return null;
  }

  if (digits.length < 7 || digits.length > 15) {
    return "Enter a valid phone number (7–15 digits)";
  }
  return null;
}

export function getFullPhoneError(value: string): string | null {
  const digits = toPhoneDigits(value);
  if (!digits) return "Phone number is required";

  const phone = parsePhoneNumberFromString(`+${digits}`);
  if (!phone) {
    return "Enter a valid phone number with country code";
  }

  const expected = getExpectedNationalDigits(phone.country);
  const national = phone.nationalNumber;

  if (expected && national.length !== expected) {
    return `Enter a valid ${expected}-digit phone number for ${phone.country || "this country"}`;
  }

  if (expected && national.length === expected) {
    return null;
  }

  if (!phone.isValid()) {
    return expected ? `Enter a valid ${expected}-digit phone number` : "Enter a valid phone number";
  }

  return null;
}

export function getSplitPhoneError(phoneCode: string, phoneNumber: string): string | null {
  const dial = toPhoneDigits(phoneCode);
  const national = toPhoneDigits(phoneNumber);

  if (!dial) return "Select country code";
  if (!national) return "Phone number is required";

  const phone = parsePhoneNumberFromString(`+${dial}${national}`);
  if (!phone) return "Enter a valid phone number";

  const expected = getExpectedNationalDigits(phone.country);
  if (expected && national.length !== expected) {
    return `Enter a valid ${expected}-digit phone number`;
  }

  if (expected && national.length === expected) {
    return null;
  }

  if (!phone.isValid()) {
    return expected ? `Enter a valid ${expected}-digit phone number` : "Enter a valid phone number";
  }

  return null;
}

export type CountryPhoneInfo = {
  isoCode: string;
  dialCode: string;
  rawDialCode: string;
};

export function getCountryPhoneInfo(
  countryNameOrId?: string | null,
  fallbackCountries?: {
    id?: string;
    name?: string;
    countryName?: string;
    countryCode?: string | null;
  }[],
): CountryPhoneInfo | null {
  if (!countryNameOrId) return null;
  const clean = countryNameOrId.trim().toLowerCase();

  const allCountries = Country.getAllCountries();
  let found = allCountries.find(
    (c) => c.name.toLowerCase() === clean || c.isoCode.toLowerCase() === clean,
  );

  if (!found && fallbackCountries?.length) {
    const apiMatch = fallbackCountries.find(
      (ac) =>
        ac.id?.toLowerCase() === clean ||
        ac.name?.toLowerCase() === clean ||
        ac.countryName?.toLowerCase() === clean,
    );
    if (apiMatch) {
      const matchName = apiMatch.name || apiMatch.countryName;
      found = allCountries.find(
        (c) =>
          (matchName && c.name.toLowerCase() === matchName.toLowerCase()) ||
          (apiMatch.countryCode && c.isoCode.toLowerCase() === apiMatch.countryCode.toLowerCase()),
      );
    }
  }

  if (found && found.phonecode) {
    const rawDialCode = found.phonecode.replace(/\D/g, "");
    if (rawDialCode) {
      return {
        isoCode: found.isoCode,
        dialCode: `+${rawDialCode}`,
        rawDialCode,
      };
    }
  }

  return null;
}

export function parseInitialPhone(
  savedCode?: string | null,
  savedNumber?: string | null,
  countryPhoneInfo?: CountryPhoneInfo | null,
): { phoneCode: string; phoneNumber: string } {
  const defaultDialCode = countryPhoneInfo?.dialCode || "+91";

  if (!savedNumber) {
    return {
      phoneCode: savedCode && savedCode !== "+91" ? savedCode : defaultDialCode,
      phoneNumber: "",
    };
  }

  const num = savedNumber.trim();

  // If phone number starts with '+':
  if (num.startsWith("+")) {
    if (countryPhoneInfo && num.startsWith(countryPhoneInfo.dialCode)) {
      return {
        phoneCode: countryPhoneInfo.dialCode,
        phoneNumber: num.slice(countryPhoneInfo.dialCode.length).trim(),
      };
    }
    if (savedCode && num.startsWith(savedCode)) {
      return {
        phoneCode: savedCode,
        phoneNumber: num.slice(savedCode.length).trim(),
      };
    }
  }

  // If phone number starts with country's raw dial code (e.g. "6390812628" starts with "63"):
  if (countryPhoneInfo?.rawDialCode && num.startsWith(countryPhoneInfo.rawDialCode)) {
    return {
      phoneCode: countryPhoneInfo.dialCode,
      phoneNumber: num.slice(countryPhoneInfo.rawDialCode.length).trim(),
    };
  }

  // Effective code: if savedCode was "+91" (default fallback) but country is something else (e.g. Philippines):
  const effectiveCode =
    countryPhoneInfo && (!savedCode || savedCode === "+91")
      ? countryPhoneInfo.dialCode
      : savedCode || defaultDialCode;

  let cleanNum = num;
  if (cleanNum.startsWith(effectiveCode)) {
    cleanNum = cleanNum.slice(effectiveCode.length).trim();
  } else {
    const cleanRaw = effectiveCode.replace(/\D/g, "");
    if (cleanRaw && cleanNum.startsWith(cleanRaw)) {
      cleanNum = cleanNum.slice(cleanRaw.length).trim();
    }
  }

  return {
    phoneCode: effectiveCode,
    phoneNumber: cleanNum,
  };
}
