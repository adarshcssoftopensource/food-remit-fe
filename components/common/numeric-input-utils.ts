/** Strips everything except digits and (optionally) a single decimal point. */
export function sanitizeNumericInput(raw: string, decimals = 0): string {
  const normalized = raw.replace(/,/g, ".");
  if (decimals <= 0) return normalized.replace(/\D/g, "");

  const cleaned = normalized.replace(/[^\d.]/g, "");
  const [whole = "", ...rest] = cleaned.split(".");
  if (!rest.length) return whole;
  return `${whole}.${rest.join("").slice(0, decimals)}`;
}
