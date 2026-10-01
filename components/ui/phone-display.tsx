"use client";

import { findPhoneCountry } from "@/components/ui/phone-input-utils";
import { cn } from "@/lib/utils";

type PhoneDisplayProps = {
  countryCode?: string | null;
  phoneNumber?: string | null;
  /** Full combined value like "12223334444" or "+112223334444" */
  value?: string | null;
  /** ISO hint when countryCode is only "+1" (e.g. "US" or "CA") */
  countryIso?: string | null;
  className?: string;
  emptyLabel?: string;
};

type ResolvedPhoneCountry = ReturnType<typeof findPhoneCountry>;

function resolveDisplayCountry(
  countryIso?: string | null,
  countryCode?: string | null,
  value?: string | null,
): ResolvedPhoneCountry {
  return (
    findPhoneCountry(countryIso) ||
    findPhoneCountry(countryCode) ||
    (value ? findPhoneCountry(value) : undefined)
  );
}

function resolveDialPrefix(country: ResolvedPhoneCountry, countryCode?: string | null): string {
  return country?.dialCode
    ? `+${country.dialCode}`
    : countryCode
      ? countryCode.startsWith("+")
        ? countryCode
        : `+${countryCode}`
      : "";
}

function resolveDisplayNumber(
  country: ResolvedPhoneCountry,
  dial: string,
  phoneNumber?: string | null,
  value?: string | null,
): string {
  const national = (phoneNumber || "").replace(/\D/g, "");
  return national
    ? `${dial} ${national}`.trim()
    : value
      ? value.startsWith("+")
        ? value
        : dial
          ? `${dial} ${String(value).replace(new RegExp(`^\\+?${country?.dialCode || ""}`), "")}`.trim()
          : value
      : "";
}

/**
 * Consistent phone display with flag everywhere (lists, profile, detail views).
 * Shared dial codes (+1) prefer USA unless countryIso is provided.
 */
export function PhoneDisplay({
  countryCode,
  phoneNumber,
  value,
  countryIso,
  className,
  emptyLabel = "—",
}: PhoneDisplayProps) {
  const country = resolveDisplayCountry(countryIso, countryCode, value);
  const dial = resolveDialPrefix(country, countryCode);
  const displayNumber = resolveDisplayNumber(country, dial, phoneNumber, value);

  if (!displayNumber && !country) {
    return <span className={cn("text-sm text-slate-500", className)}>{emptyLabel}</span>;
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm", className)}>
      {country?.flag ? (
        <span aria-hidden className="text-base leading-none">
          {country.flag}
        </span>
      ) : null}
      <span className="font-medium text-slate-800 tabular-nums dark:text-slate-200">
        {displayNumber || emptyLabel}
      </span>
    </span>
  );
}
