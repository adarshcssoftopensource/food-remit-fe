const TZ_TO_COUNTRY: Record<string, string> = {
  "Asia/Kolkata": "IN",
  "Asia/Calcutta": "IN",
  "Asia/Dubai": "AE",
  "Europe/Tirane": "AL",
  "America/New_York": "US",
  "America/Los_Angeles": "US",
  "America/Chicago": "US",
  "Europe/London": "GB",
};

export function detectViewerCountryCode(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && TZ_TO_COUNTRY[tz]) return TZ_TO_COUNTRY[tz];
  } catch {
    /* ignore */
  }

  const offsetMinutes = -new Date().getTimezoneOffset();
  if (offsetMinutes === 330) return "IN";

  const languages = [
    ...(navigator.languages || []),
    navigator.language,
    (navigator as Navigator & { userLanguage?: string }).userLanguage,
  ].filter(Boolean) as string[];

  for (const lang of languages) {
    const match = lang.match(/-([A-Za-z]{2})\b/);
    if (match?.[1]) return match[1].toUpperCase();
  }

  return null;
}
