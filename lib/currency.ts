import { findWorldCountryByIso, findWorldCountryByName } from "@/lib/world-locations";

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  AUD: "A$",
  CAD: "C$",
  NZD: "NZ$",
  JPY: "¥",
  CNY: "¥",
  CHF: "CHF",
  AED: "د.إ",
  SAR: "﷼",
  SGD: "S$",
  HKD: "HK$",
  KRW: "₩",
  THB: "฿",
  MYR: "RM",
  PHP: "₱",
  IDR: "Rp",
  VND: "₫",
  PKR: "₨",
  BDT: "৳",
  LKR: "Rs",
  NPR: "रू",
  ALL: "L",
  ZAR: "R",
  NGN: "₦",
  KES: "KSh",
  GHS: "GH₵",
  EGP: "E£",
  TRY: "₺",
  RUB: "₽",
  BRL: "R$",
  MXN: "Mex$",
  ARS: "AR$",
  CLP: "CLP$",
  COP: "COL$",
  PEN: "S/",
  SEK: "kr",
  NOK: "kr",
  DKK: "kr",
  PLN: "zł",
};

export type ResolveCurrencyOptions = {
  currency?: string | null;
  countryName?: string | null;
  countryCode?: string | null;
};

function fromCode(code: string): { code: string; symbol: string } {
  const upper = code.toUpperCase();
  return {
    code: upper,
    symbol: CURRENCY_SYMBOLS[upper] || upper,
  };
}

export function resolveCurrencyDisplay(
  currencyOrOptions?: string | null | ResolveCurrencyOptions,
  countryName?: string | null,
  countryCode?: string | null,
): {
  code: string;
  symbol: string;
} {
  const options: ResolveCurrencyOptions =
    currencyOrOptions && typeof currencyOrOptions === "object"
      ? currencyOrOptions
      : {
          currency: currencyOrOptions,
          countryName,
          countryCode,
        };

  const raw = options.currency?.trim();
  if (raw) {
    const upper = raw.toUpperCase();
    if (/^[A-Z]{3}$/.test(upper)) {
      return fromCode(upper);
    }
    // Already a symbol like "₹" or "$"
    return { code: raw, symbol: raw };
  }

  const world =
    findWorldCountryByIso(options.countryCode) || findWorldCountryByName(options.countryName);

  if (world?.currency) {
    return fromCode(world.currency);
  }

  return { code: "USD", symbol: "$" };
}
