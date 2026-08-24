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

  if (!phone.isValid()) {
    return expected ? `Enter a valid ${expected}-digit phone number` : "Enter a valid phone number";
  }

  return null;
}
