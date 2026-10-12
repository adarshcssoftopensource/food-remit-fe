import { detectViewerCountryCode } from "@/lib/utils/detect-viewer-country";
import { resolveWorldCountryIsoCode } from "@/lib/world-locations";

/**
 * Global, country-aware date presentation.
 *
 * Only the display string changes with the applicable country; the underlying
 * value (ISO string / epoch / Date) is never mutated, so sorting, filtering and
 * API payloads keep using the raw value.
 */

export type DateInput = string | number | Date | null | undefined;

type ResolvedLocale = { date: string; time: string };

const DEFAULT_FALLBACK = "-";
const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const EPOCH_PATTERN = /^\d{11,}$/;
const BIDI_MARKS = /[\u200e\u200f\u061c]/g;

let activeCountry: string | null = null;
const localeCache = new Map<string, ResolvedLocale>();
const formatterCache = new Map<string, Intl.DateTimeFormat>();

function normalizeCountry(value?: string | null): string | null {
  const code = value?.trim().toUpperCase();
  return code && /^[A-Z]{2}$/.test(code) ? code : null;
}

/**
 * Resolves the ISO-3166 alpha-2 code for a country given as ISO code or name.
 * Phone dial codes and database ids are ignored.
 */
export function resolveDateCountry(
  countryCode?: string | null,
  countryName?: string | null,
): string | null {
  return resolveWorldCountryIsoCode(countryName, normalizeCountry(countryCode));
}

/** Sets the applicable country/market used for every user-facing date. */
export function setDateDisplayCountry(countryCode: string | null | undefined): void {
  activeCountry = normalizeCountry(countryCode);
}

function detectBrowserCountry(): string | null {
  const viewerCountry = detectViewerCountryCode();
  if (viewerCountry) return viewerCountry;
  if (typeof navigator === "undefined") return null;
  try {
    return normalizeCountry(new Intl.Locale(navigator.language).maximize().region);
  } catch {
    return null;
  }
}

export function getDateDisplayCountry(): string {
  return activeCountry ?? detectBrowserCountry() ?? "US";
}

function resolveLocale(country: string): ResolvedLocale {
  const cached = localeCache.get(country);
  if (cached) return cached;

  let resolved: ResolvedLocale = { date: "en-US", time: "en-US" };
  try {
    const english = `en-${country}`;
    if (new Intl.DateTimeFormat(english).resolvedOptions().locale === english) {
      resolved = { date: english, time: english };
    } else {
      // English has no regional data for this country (e.g. JP, AL, BR): take the
      // date order from the country's primary language, keeping Latin digits and the
      // Gregorian calendar so the value stays unambiguous.
      const { language, region } = new Intl.Locale(`und-${country}`).maximize();
      const native = `${language}-${region}`;
      const { hourCycle } = new Intl.DateTimeFormat(native, { hour: "numeric" }).resolvedOptions();
      resolved = {
        date: `${native}-u-ca-gregory-nu-latn`,
        time: hourCycle === "h23" || hourCycle === "h24" ? "en-GB" : "en-US",
      };
    }
  } catch {
    // Keep the en-US default.
  }

  localeCache.set(country, resolved);
  return resolved;
}

function getFormatter(locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${locale}|${JSON.stringify(options)}`;
  let formatter = formatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, options);
    formatterCache.set(key, formatter);
  }
  return formatter;
}

/**
 * Parses a raw date value. Date-only strings (YYYY-MM-DD) are calendar dates, so
 * they are pinned to UTC to avoid shifting a day in negative-offset time zones.
 */
function parseDate(value: DateInput): { date: Date; calendarOnly: boolean } | null {
  if (value === null || value === undefined || value === "") return null;

  let date: Date;
  let calendarOnly = false;

  if (value instanceof Date) {
    date = value;
  } else if (typeof value === "number") {
    date = new Date(value);
  } else {
    const trimmed = value.trim();
    if (DATE_ONLY_PATTERN.test(trimmed)) {
      date = new Date(`${trimmed}T00:00:00Z`);
      calendarOnly = true;
    } else if (EPOCH_PATTERN.test(trimmed)) {
      date = new Date(Number(trimmed));
    } else {
      date = new Date(trimmed);
    }
  }

  return Number.isNaN(date.getTime()) ? null : { date, calendarOnly };
}

function formatParts(
  value: DateInput,
  fallback: string,
  parts: { date: boolean; time: boolean },
  displayTimeZone?: string,
): string {
  const parsed = parseDate(value);
  if (!parsed) return fallback;

  const locale = resolveLocale(getDateDisplayCountry());
  const timeZone = parsed.calendarOnly ? "UTC" : displayTimeZone;
  const segments: string[] = [];

  if (parts.date) {
    segments.push(
      getFormatter(locale.date, { year: "numeric", month: "2-digit", day: "2-digit", timeZone })
        .format(parsed.date)
        .replace(BIDI_MARKS, ""),
    );
  }
  if (parts.time && !parsed.calendarOnly) {
    segments.push(
      getFormatter(locale.time, { hour: "numeric", minute: "2-digit", timeZone }).format(
        parsed.date,
      ),
    );
  }

  return segments.length ? segments.join(", ") : fallback;
}

/** e.g. US → 10/12/2026, IN/GB → 12/10/2026, JP → 2026/10/12 */
export function formatDate(
  value: DateInput,
  fallback: string = DEFAULT_FALLBACK,
  timeZone?: string,
): string {
  return formatParts(value, fallback, { date: true, time: false }, timeZone);
}

/** e.g. US → 10/12/2026, 3:04 PM, GB → 12/10/2026, 15:04 */
export function formatDateTime(
  value: DateInput,
  fallback: string = DEFAULT_FALLBACK,
  timeZone?: string,
): string {
  return formatParts(value, fallback, { date: true, time: true }, timeZone);
}

/** e.g. US → 3:04 PM, GB → 15:04 */
export function formatTime(
  value: DateInput,
  fallback: string = DEFAULT_FALLBACK,
  timeZone?: string,
): string {
  return formatParts(value, fallback, { date: false, time: true }, timeZone);
}

function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** "Today, 3:04 PM" / "Yesterday, 3:04 PM", otherwise the full {@link formatDateTime}. */
export function formatRecentDateTime(
  value: DateInput,
  fallback: string = DEFAULT_FALLBACK,
): string {
  const parsed = parseDate(value);
  if (!parsed) return fallback;
  if (parsed.calendarOnly) return formatDate(value, fallback);

  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (isSameLocalDay(parsed.date, now)) return `Today, ${formatTime(parsed.date)}`;
  if (isSameLocalDay(parsed.date, yesterday)) return `Yesterday, ${formatTime(parsed.date)}`;
  return formatDateTime(parsed.date, fallback);
}

/** Numeric sort key for a raw date value; never use the formatted string for sorting. */
export function toDateSortValue(value: DateInput): number {
  return parseDate(value)?.date.getTime() ?? 0;
}
