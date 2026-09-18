"use client";

import { findPhoneCountry } from "@/components/ui/phone-input";
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
  const country =
    findPhoneCountry(countryIso) ||
    findPhoneCountry(countryCode) ||
    (value ? findPhoneCountry(value) : undefined);

  const dial = country?.dialCode
    ? `+${country.dialCode}`
    : countryCode
      ? countryCode.startsWith("+")
        ? countryCode
        : `+${countryCode}`
      : "";

  const national = (phoneNumber || "").replace(/\D/g, "");
  const displayNumber = national
    ? `${dial} ${national}`.trim()
    : value
      ? value.startsWith("+")
        ? value
        : dial
          ? `${dial} ${String(value).replace(new RegExp(`^\\+?${country?.dialCode || ""}`), "")}`.trim()
          : value
      : "";

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
